import { boilerplateMessages, replacePlaceholders } from "../promptgen.js";
import { ChatCompletionMessageParam } from "openai/resources";
import { Model } from "sequelize";
import { promptAIObject } from "../../util/ai.js";
import { TestcaseSuggestionResponse } from "forge-shared/dto/response/testcasesuggestionresponse.dto";
import { testcaseSuggestionResponseJsonSchema } from "../../jsonschemas/testcasesuggestionresponse.jsonschema.js";
import logging from "../../util/logging.js";

const basePrompt = `You must generate a helpful testcase for my project "[project]", more specifically for the userstory "[userstory]" and it's 
acceptance criteria "[acceptancecriteria]". The testcase should test for something you judge is relevant under the given context, but not too 
specific because you do not know exactly what will be tested, which could be a graphical user interface, which you don't know about. The testcase
should have a description, a pre-condition (Or "None") and at least 1 test step, but no more than 6. Each step should have an action and an expected
behavior, which should be clear and concise. To provide you with more context, the aforementioned userstory currently has the following tasks "[tasks]"
and belongs to the epic "[epic]". The given acceptance criteria already has the following testcase(s) "[testcases]", which you should not repeat. With
this information, generate a testcase that is unique and relevant to the context and unequivocally follows the provided JSON schema. No string
inside the JSON should be longer than 256 characters. The new testcase should be entirely in the same language as the text inside the quoted values,
if you're not sure then default to English.`;

function populateBasePrompt(acceptancecriteria: Model<any, any>): string {
	const testcases = acceptancecriteria.dataValues.testcases;
	const userstory = acceptancecriteria.dataValues.userstory;
	const epic = userstory.dataValues.epic;
	const project = epic.dataValues.project;
	const tasks = userstory.dataValues.tasks;

	const replacements = {
		project: `${project.dataValues.title}, ${project.dataValues.description}`,
		userstory: `${userstory.dataValues.title}, ${userstory.dataValues.description}, ${userstory.dataValues.narrative}, (As a ${userstory.dataValues.storyActor}, I want to ${userstory.dataValues.storyObjective} so that ${userstory.dataValues.storyJustification})`,
		acceptancecriteria: `Given ${acceptancecriteria.dataValues.criteriaGiven}, when ${acceptancecriteria.dataValues.criteriaWhen}, then ${acceptancecriteria.dataValues.criteriaThen}`,
		tasks: tasks.length > 0 ? tasks.map((task: any) => task.dataValues.title) : "(None yet)",
		epic: `${epic.dataValues.title}, ${epic.dataValues.description}`,
		testcases: testcases.length > 0 ? testcases.map((testcase: any) => testcase.dataValues.description) : "(None yet)",
	};

	return replacePlaceholders(basePrompt, replacements);
}

export function promptAITestcase(acceptancecriteria: Model<any, any>): Promise<TestcaseSuggestionResponse | null> {
	const basePrompt = populateBasePrompt(acceptancecriteria);
	logging.logDebug("prompt", basePrompt);

	const messages: ChatCompletionMessageParam[] = [
		...boilerplateMessages(),
		{
			role: "user",
			content: basePrompt,
		},
	];

	return promptAIObject(
		messages,
		testcaseSuggestionResponseJsonSchema,
		true,
		"The JSON Schema for the new testcase suggestion",
	);
}
