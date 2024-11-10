import { ChatCompletion, ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions.js";
import { ChatCompletionMessageParam, ResponseFormatJSONSchema } from "openai/resources";
import { validate } from "jsonschema";
import logging from "./logging.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] as string });

function tokenStrEstimator(message: string): number {
	return Math.round(message.length / 4);
}

function tokenMessagesEstimator(messages: ChatCompletionMessageParam[]): number {
	return messages.reduce((acc, message) => acc + tokenStrEstimator(message.content as string), 0);
}

async function internalAIPrompt(options: ChatCompletionCreateParamsNonStreaming) {
	logging.logDebug("openai", "Prompting AI with approximatedly", tokenMessagesEstimator(options.messages), "tokens");

	const requestTime = Date.now();

	let completion: ChatCompletion | undefined;
	try {
		completion = await openai.chat.completions.create(options);
	} catch (error) {
		logging.logError("openai", "Failed to prompt AI:", error);
		return null;
	}

	if (completion.choices.some((choice) => choice.message.refusal)) {
		logging.logDebug("openai", "AI refused to complete one or more prompts");
		return null;
	}

	if (completion.choices.some((choice) => choice.finish_reason === "length")) {
		logging.logDebug("openai", "AI did not complete one or more prompts due to length");
		return null;
	}

	if (options.response_format?.type === "json_schema") {
		const schema = options.response_format.json_schema.schema;
		for (const choice of completion.choices) {
			try {
				const objectContent = JSON.parse(choice.message.content!);
				const validationResult = validate(objectContent, schema);
				if (!validationResult.valid) {
					throw new Error("Invalid schema: " + validationResult.errors.join(", "));
				}
			} catch (error) {
				logging.logDebug("openai", "AI failed to parse one or more prompts as JSON:", error);
				logging.logDebug("openai", "Raw response:", choice.message.content);
				return null;
			}
		}
	}

	const timeTaken = ((Date.now() - requestTime) / 1000).toFixed(2);
	logging.logDebug("openai", "Prompt succeeded in", timeTaken, "seconds");

	const responseTokens = tokenStrEstimator(completion.choices.map((choice) => choice.message.content).join(" "));
	logging.logDebug("openai", "The response amounts to approximatedly", responseTokens, "tokens");

	return completion;
}

export async function promptAIText(messages: ChatCompletionMessageParam[]) {
	const completion = await internalAIPrompt({
		model: "gpt-4o",
		messages: messages,
	});

	return completion?.choices[0]?.message?.content ?? null;
}

export async function promptAIObject<T>(
	messages: ChatCompletionMessageParam[],
	schema: any,
	schemaStrict = true,
	schemaDescription = "The JSON Schema the response must unequivocally adhere to",
) {
	const jsonSchema: ResponseFormatJSONSchema.JSONSchema = {
		name: schema.title,
		description: schemaDescription,
		schema: schema,
		strict: schemaStrict,
	};

	const completion = await internalAIPrompt({
		model: "gpt-4o",
		messages: messages,
		response_format: {
			type: "json_schema",
			json_schema: jsonSchema,
		},
	});

	if (!completion?.choices[0]?.message?.content) {
		return null;
	}

	return JSON.parse(completion.choices[0].message.content!) as T;
}
