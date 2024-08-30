import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapEpicResponse } from "../../mappers/response/epicresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const epicId = decryptPK("epic", req.params["epicEid"]);

	let epic: any;

	try {
		epic = await sequelize.models["epic"].findOne({
			where: {
				id: epicId,
				projectId: authProject.project.dataValues.id,
			},
			transaction,
			include: [sequelize.models["userstory"]],
		});

		if (!epic) {
			throw new BadRequestError("Epic not found in the project");
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapEpicResponse(epic, authProject.project.dataValues.code);
	res.status(200).send(response);
}
