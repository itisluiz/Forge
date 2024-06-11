import { ChatCompletionMessageParam } from "openai/resources";
import logging from "../logging.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] as string });

function tokenStrEstimator(message: string): number {
	return Math.round(message.length / 4);
}

function tokenMessagesEstimator(messages: ChatCompletionMessageParam[]): number {
	return messages.reduce((acc, message) => acc + tokenStrEstimator(message.content as string), 0);
}

export async function promptAI(messages: ChatCompletionMessageParam[], requestJSON = false): Promise<string | undefined> {
	logging.logDebug("openai", "Prompting AI with approximatedly", tokenMessagesEstimator(messages), "tokens");

	const requestTime = Date.now();

	let completion;
	try {
		completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			response_format: { type: requestJSON ? "json_object" : "text" },
			stream: false,
			temperature: 0.3,
			messages,
		});
	} catch (error) {
		logging.logError("openai", "Failed to prompt AI:", error);
		return undefined;
	}

	const timeTaken = ((Date.now() - requestTime) / 1000).toFixed(2);
	const responseString = completion.choices[0].message.content as string;

	logging.logDebug(
		"openai",
		"Got response in",
		timeTaken,
		"seconds",
		"with approximatedly",
		tokenStrEstimator(responseString),
		"tokens",
	);

	return responseString;
}

export async function promptAIObject<T>(messages: ChatCompletionMessageParam[]): Promise<T | undefined> {
	const responseString = await promptAI(messages, true);
	if (!responseString) {
		return undefined;
	}

	try {
		return JSON.parse(responseString) as T;
	} catch (error) {
		logging.logError("openai", "Failed to parse AI response as JSON");
	}

	return undefined;
}
