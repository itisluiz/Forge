import { UserStory } from "forge-shared/dto/userstory.dto";
import { Response } from "express";
import { getSequelize } from "../../util/sequelize.js";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	let userStory = {} as UserStory;

	const userStoryModel = await sequelize.models["userstory"].findByPk(1, {
		include: [
			{
				model: sequelize.model("acceptancecriteria"),
				include: [{ model: sequelize.model("testcase"), include: [{ model: sequelize.model("testcasestep") }] }],
			},
		],
	});

	userStory.title = userStoryModel?.dataValues.title as string;
	userStory.description = userStoryModel?.dataValues.description as string;
	userStory.actor = userStoryModel?.dataValues.storyActor as string;
	userStory.objective = userStoryModel?.dataValues.storyObjective as string;
	userStory.justification = userStoryModel?.dataValues.storyJustification as string;

	userStory.acceptanceCriteria = userStoryModel?.dataValues.acceptancecriteria.map((ac: any) => ({
		id: ac.id,
		given: ac.criteriaGiven,
		when: ac.criteriaWhen,
		then: ac.criteriaThen,
		tests: ac.testcases.map((tc: any) => ({
			title: tc.title,
			steps: tc.testcasesteps.map((tcs: any) => tcs.description),
		})),
	}));

	res.json(userStory);
}
