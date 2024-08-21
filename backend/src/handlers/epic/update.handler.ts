import { Request, Response } from "express";
import { EpicResponse } from "forge-shared/dto/response/epicresponse.dto";
import { EpicUpdateRequest } from "forge-shared/dto/request/epicupdaterequest.dto.js";
import { getSequelize } from "../../util/sequelize.js";
import { decryptPK } from "../../util/encryption.js";

export default async function (req: Request, res: Response) {
	const epicUpdateRequest = req.body as EpicUpdateRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();

	let epic: any;

	try {
		const projectId = decryptPK("project", req.params["projectEid"]);
		const epicId = req.params["epicId"];

		epic = await sequelize.models["epic"].findOne({
			where: {
				id: epicId,
				projectId: projectId,
			},
			transaction,
		});

		epic.set(
			{
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

	const response: EpicResponse = {
		id: epic.id,
		title: epic.title,
		description: epic.description,
		projectId: epic.projectId,
	};

	res.status(200).send(response);
}
