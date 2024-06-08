import { ChatCompletionMessageParam } from "openai/resources";

export interface AIType<T extends object> {
	mocks: T[];
	description: object;
}

export function buildJSONForPrompt(obj: object) {
	return "\n```json\n" + JSON.stringify(obj) + "\n```\n";
}

export function buildPromptForAIType<T extends object>(aiType: AIType<T>): ChatCompletionMessageParam[] {
	const mockPrompt = aiType.mocks.map((mock) => buildJSONForPrompt(mock)).join("or");
	console.log(mockPrompt);
	return [
		{
			role: "system",
			content: "Your response MUST be a perfectly parseable, syntax-error free JSON, with nothing but the JSON",
		},
		{
			role: "system",
			content: `The JSON you should produce should strictly match the following format description: ${buildJSONForPrompt(aiType.description)}`,
		},
		{
			role: "system",
			content: `Meaning that what your JSON should look like could, as an example, be: ${mockPrompt}`,
		},
		{
			role: "system",
			content: "Use the examples exclusively as a reference for the JSON structure",
		},
	];
}
