import { buildPromptForAIType } from "../aitype/aitype.js";
import { ChatCompletionMessageParam } from "openai/resources";
import { Person } from "forge-shared/dto/person.dto";
import { promptAIObject } from "../../../util/ai/ai.js";
import personAIType from "../aitype/person.aitype.js";

async function fromCountry(country: string): Promise<Person | undefined> {
	const messages = [
		{
			role: "user",
			content: `Generate a random person with random values from ${country}`,
		},
		...buildPromptForAIType(personAIType),
	] as ChatCompletionMessageParam[];

	return promptAIObject<Person>(messages);
}

export default { fromCountry };
