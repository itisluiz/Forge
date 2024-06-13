import { NewUserStory } from "forge-shared/dto/newuserstory.dto";
import { Response } from "express";
import { getSequelize } from "../../util/sequelize.js";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const newUserStory: NewUserStory = req.body as any as NewUserStory;

	await sequelize.models["acceptancecriteria"].destroy({ where: { userstoryId: 1 }, restartIdentity: true, cascade: true });
	await sequelize.models["userstory"].destroy({ where: { id: 1 }, restartIdentity: true });
	await sequelize.models["userstory"].create({
		id: 1,
		title: newUserStory.title,
		description: newUserStory.description,
		storyActor: newUserStory.actor,
		storyObjective: newUserStory.objective,
		storyJustification: newUserStory.justification,
		epriorityId: 1,
	});

	for (const acceptanceCriteria of newUserStory.acceptanceCriteria) {
		await sequelize.models["acceptancecriteria"].create({
			criteriaGiven: acceptanceCriteria.given,
			criteriaWhen: acceptanceCriteria.when,
			criteriaThen: acceptanceCriteria.then,
			userstoryId: 1,
		});
	}

	res.send();
}
