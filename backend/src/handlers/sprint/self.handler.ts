import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapSprintSelfResponse } from "../../mappers/response/sprintselfresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let sprints: any;

	try {
		sprints = await sequelize.models["sprint"].findAll({
			where: {
				projectId: authProject.projectId,
			},
			order: [["startsAt", "ASC"]],
			transaction,
		});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapSprintSelfResponse(sprints);
	res.status(200).send(response);
}
