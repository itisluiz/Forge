import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { EpicUpdateRequest } from "forge-shared/dto/request/epicupdaterequest.dto.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapEpicResponse } from "../../mappers/response/epicresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const epicUpdateRequest = req.body as EpicUpdateRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const epicId = decryptPK("epic", req.params["epicEid"]);

	let epic: any;

	try {
		epic = await sequelize.models["epic"].findOne({
			where: {
				id: epicId,
				projectId: authProject.projectId,
			},
			transaction,
		});

		if (!epic) {
			throw new BadRequestError("Epic not found in the project");
		}

		epic.set(
			{
				...(epicUpdateRequest.code && { code: epicUpdateRequest.code }),
				...(epicUpdateRequest.title && { title: epicUpdateRequest.title }),
				...(epicUpdateRequest.description && { description: epicUpdateRequest.description }),
			},
			{ transaction },
		);

		await epic.save({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapEpicResponse(epic);
	res.status(200).send(response);
}
