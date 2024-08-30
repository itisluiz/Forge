import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapEpicSelfResponse } from "../../mappers/response/epicselfresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	let epics: any;

	try {
		epics = await sequelize.models["epic"].findAll({
			where: {
				projectId: authProject.projectId,
			},
			attributes: ["id", "title", "description"],
			transaction,
		});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapEpicSelfResponse(epics);
	res.status(200).send(response);
}
