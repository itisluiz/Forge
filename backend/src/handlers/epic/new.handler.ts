import { EpicNewRequest } from "forge-shared/dto/request/epicnewrequest.dto.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapEpicResponse } from "../../mappers/response/epicresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const epicNewRequest = req.body as EpicNewRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let epic: any;

	try {
		epic = await sequelize.models["epic"].create(
			{
				title: epicNewRequest.title,
				description: epicNewRequest.description,
				projectId: authProject.project.dataValues.id,
			},
			{ transaction, include: [sequelize.models["userstory"]] },
		);

		await epic.reload({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapEpicResponse(epic);
	res.status(200).send(response);
}
