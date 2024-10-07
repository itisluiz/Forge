import { ChatCompletionMessageParam } from "openai/resources";

export function boilerplateMessages(): ChatCompletionMessageParam[] {
	return [
		{
			role: "system",
			content:
				"You are a helpful assistant on a platform for agile development teams such as Jira or Azure DevOps, it is called Forge. You are provided with very specific tasks with which you will aid the user on his project.",
		},
		{
			role: "system",
			content:
				"You will be given a specific task to execute by the user regarding his agile processes and you must generate a helpful response that exactly satisfies user's request.",
		},
	];
}

export function replacePlaceholders(text: string, values: { [key: string]: string | string[] }): string {
	return text.replace(/\[([^\]]+)\]/gi, (match, key) => {
		const lowerKey = key.toLowerCase();
		const value = values[lowerKey];

		if (Array.isArray(value)) {
			return value.join(", ");
		}

		return value || match;
	});
}
