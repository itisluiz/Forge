import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapUserstorySelfResponse } from "../../mappers/response/userstoryselfresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const epicId = decryptPK("epic", req.params["epicEid"]);

	let userstories: any;

	try {
		userstories = await sequelize.models["userstory"].findAll({
			where: {
				epicId: epicId,
			},
			include: {
				model: sequelize.models["epic"],
				where: {
					projectId: authProject.projectId,
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

	const response = mapUserstorySelfResponse(userstories);
	res.status(200).send(response);
}
