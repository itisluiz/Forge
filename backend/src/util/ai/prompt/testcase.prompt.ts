import { buildPromptForAIType } from "../aitype/aitype.js";
import { ChatCompletionMessageParam } from "openai/resources";
import { AITestCase } from "forge-shared/dto/aitestcase.dto";
import { promptAIObject } from "../../../util/ai/ai.js";
import testcaseAIType from "../aitype/testcase.aitype.js";
import { UserStory } from "forge-shared/dto/userstory.dto.js";

async function fromUserStory(ac: any, userStory: UserStory): Promise<AITestCase | undefined> {
	const existingTests = ac.tests.map((t: any) => t.title).join(", ");

	console.log("Existing tests: ", existingTests);
	const messages: ChatCompletionMessageParam[] = [
		{
			role: "system",
			content: `You will help the user create a test case for a given acceptance criteria (${ac.title}) of a user story (${userStory.title}).`,
		},
		{
			role: "system",
			content: `The user story is as follows: As a(n) ${userStory.actor}, I want to ${userStory.objective} so that ${userStory.justification}.`,
		},
		{
			role: "system",
			content: `The acceptance criteria is as follows: Given ${ac.given}, When ${ac.when}, Then ${ac.then}.`,
		},
		{
			role: "system",
			content:
				"When creating the new test case, try to create between 3 and 6 test steps, though less or more are acceptable if you see fit.",
		},
		{
			role: "user",
			content:
				"Create a test case for my user story/acceptance criteria where the steps aren't too specific as to describe the UI of a system but not too vague as to be unhelpful.",
		},
		...((ac.tests.length > 0
			? [
					{
						role: "system",
						content: `The following test cases already exist: [${existingTests}] make sure to test something different to what's on the list, even though the acceptance criteria is the same, the test case should have a different title and be about something else that can be tested.`,
					},
				]
			: []) as any),
		...buildPromptForAIType(testcaseAIType),
	];

	return promptAIObject<AITestCase>(messages);
}

export default { fromUserStory };
