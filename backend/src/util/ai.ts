import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import logging from "./logging.js";

const openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] as string });

function tokenStrEstimator(message: string): number {
	return Math.round(message.length / 4);
}

function tokenMessagesEstimator(messages: ChatCompletionMessageParam[]): number {
	return messages.reduce((acc, message) => acc + tokenStrEstimator(message.content as string), 0);
}

export async function promptAI(messages: ChatCompletionMessageParam[], requestObject = false): Promise<string | object> {
	logging.logDebug("openai", "Prompting AI with approximatedly", tokenMessagesEstimator(messages), "tokens");

	const requestTime = Date.now();
	const completion = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		response_format: { type: requestObject ? "json_object" : "text" },
		stream: false,
		temperature: 0.35,
		messages,
	});

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
	return requestObject ? JSON.parse(responseString) : responseString;
}
