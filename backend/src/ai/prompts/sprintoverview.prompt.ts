import { boilerplateMessages, replacePlaceholders } from "../promptgen.js";
import { ChatCompletionMessageParam } from "openai/resources";
import { Model } from "sequelize";
import { Priority } from "forge-shared/enum/priority.enum.js";
import { promptAIText } from "../../util/ai.js";
import { SprintPeriodStatus } from "forge-shared/enum/sprintperiodstatus.enum.js";
import { SprintStatus } from "forge-shared/enum/sprintstatus.enum.js";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum.js";
import { TaskType } from "forge-shared/enum/tasktype.enum.js";
import logging from "../../util/logging.js";

const basePrompt = `You must generate a helpful overview for the current state of my Agile sprint for the project "[project]". Today is "[now]", the sprint
started at "[sprintstart]" and will end/ended at "[sprintend]". The sprint user given status is "[sprintstatus]" and going by the dates, you can tell it is
a "[sprintperiodstatus]" sprint. Here's an overview of the userstories and tasks that compose the sprint, as well as some info on their status:
[userstories]

Provide an overview of the sprint that is clear and concise, in the same language as the data inside the work items. Your response should be clear text,
without any markdown, line breaks, or special formatting. Use no more than 512 characters, do not return entire dates, instead, prefer using relative terms,
like "today", "tomorrow", "yesterday", "in N days", etc, but in the same language as the data inside the work items/quoted items in this prompt. Do not put
the data between quotes everywhere as seen in this prompt, just use the data as is, in natural language. Once again, DO NOT use quotes '"' / QUOTATION MARKS
AS I DID AROUND DATA, also, when I gave you details about the project data, I separated some data with a comma, that was used to separate titles and descriptions
and such, so prefer to only refer to the data by it's title. DO NOT USE QUOTATION MARKS!, if using a different language, also translate the status names, but
don't translate key terms like "sprint" or "userstory".`;

const userstoryPrompt = `# The userstory "[userstory]" with the effort score of "[effortscore]" is in the sprint with the following tasks:
[tasks]`;

const taskPrompt = `\t## [type] "[task]" is a task assigned to "[assignee]" of priority "[priority]", with the status of "[status]" and the effort score of "[complexity]". This task was
created at "[createdat]". It was marked as started at "[startedat]" and completed at "[completedat]".`;

function populateBasePrompt(sprint: Model<any, any>): string {
	const project = sprint.dataValues.project;
	const userstories = sprint.dataValues.userstories;

	const replacements = {
		project: `${project.dataValues.title}, ${project.dataValues.description}`,
		now: new Date().toString(),
		sprintstart: sprint.dataValues.startsAt,
		sprintend: sprint.dataValues.endsAt,
		sprintstatus: strSprintStatus(sprint.dataValues.esprintstatusId),
		sprintperiodstatus: strSprintPeriodStatus((sprint as any).getPeriodStatus()),
		userstories:
			userstories.length > 0
				? userstories.map((userstory: any) => populateUserstoryPrompt(userstory)).join("\n")
				: "(No userstories yet)",
	};

	return replacePlaceholders(basePrompt, replacements);
}

function populateUserstoryPrompt(userstory: Model<any, any>): string {
	const tasks = userstory.dataValues.tasks;

	const replacements = {
		userstory: `${userstory.dataValues.title}, ${userstory.dataValues.description}`,
		effortscore: userstory.dataValues.effortScore ?? "(Not set)",
		tasks: tasks.length > 0 ? tasks.map((task: any) => populateTaskPrompt(task)).join("\n") : "(No tasks yet)",
	};

	return replacePlaceholders(userstoryPrompt, replacements);
}

function populateTaskPrompt(task: Model<any, any>): string {
	const replacements = {
		type: strTaskType(task.dataValues.etasktypeId),
		task: `${task.dataValues.title}, ${task.dataValues.description}`,
		assignee: task.dataValues.user?.dataValues.name ?? "(Unassigned)",
		priority: strPriority(task.dataValues.epriorityId),
		status: strTaskStatus(task.dataValues.etaskstatusId),
		complexity: task.dataValues.complexity ?? "(Not set)",
		createdat: task.dataValues.createdAt,
		startedat: task.dataValues.startedAt ?? "(Not started)",
		completedat: task.dataValues.completedAt ?? "(Not completed)",
	};

	return replacePlaceholders(taskPrompt, replacements);
}

export function promptAISprintoverview(sprint: Model<any, any>): Promise<string | null> {
	const basePrompt = populateBasePrompt(sprint);
	logging.logDebug("prompt", basePrompt);

	const messages: ChatCompletionMessageParam[] = [
		...boilerplateMessages(),
		{
			role: "user",
			content: basePrompt,
		},
	];

	return promptAIText(messages);
}

// TODO: Refactor the below functions to a shared location

function strSprintStatus(status: SprintStatus): string {
	switch (status) {
		case SprintStatus.PLAN:
			return "Plan";
		case SprintStatus.DESIGN:
			return "Design";
		case SprintStatus.DEVELOP:
			return "Develop";
		case SprintStatus.TEST:
			return "Test";
		case SprintStatus.DEPLOY:
			return "Deploy";
		case SprintStatus.REVIEW:
			return "Review";
		case SprintStatus.LAUNCH:
			return "Launch";
		default:
			return "Unknown";
	}
}

function strSprintPeriodStatus(status: SprintPeriodStatus): string {
	switch (status) {
		case SprintPeriodStatus.PAST:
			return "Past";
		case SprintPeriodStatus.ONGOING:
			return "On going";
		case SprintPeriodStatus.FUTURE:
			return "Future";
		default:
			return "Unknown";
	}
}

function strTaskStatus(status: TaskStatus): string {
	switch (status) {
		case TaskStatus.TODO:
			return "To-do";
		case TaskStatus.INPROGRESS:
			return "In Progress";
		case TaskStatus.AVAILABLETOREVIEW:
			return "Available to Review";
		case TaskStatus.REVIEWING:
			return "Reviewing";
		case TaskStatus.DONE:
			return "Done";
		case TaskStatus.CANCELLED:
			return "Cancelled";
		default:
			return "Unknown";
	}
}

function strTaskType(type: TaskType): string {
	switch (type) {
		case TaskType.TASK:
			return "Task";
		case TaskType.BUG:
			return "Bug";
		case TaskType.TEST:
			return "Test";
		default:
			return "Unknown";
	}
}

function strPriority(type: Priority): string {
	switch (type) {
		case Priority.LOW:
			return "Low";
		case Priority.MEDIUM:
			return "Medium";
		case Priority.HIGH:
			return "High";
		default:
			return "Unknown";
	}
}
