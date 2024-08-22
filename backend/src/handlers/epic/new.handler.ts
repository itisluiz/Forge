import { Request, Response } from "express";
import { EpicResponse } from "forge-shared/dto/response/epicresponse.dto";
import { EpicNewRequest } from "forge-shared/dto/request/epicnewrequest.dto.js";
import { getSequelize } from "../../util/sequelize.js";
import { decryptPK } from "../../util/encryption.js";

export default async function (req: Request, res: Response) {
	const epicNewRequest = req.body as EpicNewRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();

	let epic: any;

	try {
		const projectId = decryptPK("project", req.params["projectEid"]);
		epic = await sequelize.models["epic"].create(
			{
				code: epicNewRequest.code,
				title: epicNewRequest.title,
				description: epicNewRequest.description,
				projectId: projectId,
			},
			{ transaction },
		);

		await transaction.commit();
		await epic.reload();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const epicResponse: EpicResponse = {
		id: epic.id,
		code: epic.code,
		title: epic.title,
		description: epic.description,
		projectId: epic.projectId,
	};

	res.status(200).send(epicResponse);
}
