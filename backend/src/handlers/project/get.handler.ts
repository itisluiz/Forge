import { getSequelize } from "../../util/sequelize.js";
import { Request, Response } from "express";
import { getProjectData } from "../../util/requestmeta.js";
import { mapProjectResponse } from "../../mappers/response/projectresponse.mapper.js";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let project: any;

	try {
		project = await sequelize.models["project"].findByPk(authProject.projectId, {
			transaction,
			include: [sequelize.models["user"]],
		});
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapProjectResponse(project);
	res.status(200).send(response);
}
