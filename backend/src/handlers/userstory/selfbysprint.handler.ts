import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapUserstorySelfResponse } from "../../mappers/response/userstoryselfresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const sprintId = decryptPK("sprint", req.params["sprintEid"]);

	let userstories: any;

	try {
		userstories = await sequelize.models["userstory"].findAll({
			where: {
				sprintId: sprintId,
			},
			include: {
				model: sequelize.models["epic"],
				where: {
					projectId: authProject.project.dataValues.id,
				},
				attributes: ["projectId"],
			},
			transaction,
		});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapUserstorySelfResponse(userstories, authProject.project.dataValues.code);
	res.status(200).send(response);
}
