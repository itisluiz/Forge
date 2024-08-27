import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapProjectResponse } from "../../mappers/response/projectresponse.mapper.js";
import { ProjectUpdateRequest } from "forge-shared/dto/request/projectupdaterequest.dto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const projectUpdateRequest = req.body as ProjectUpdateRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let project: any;

	try {
		project = await sequelize.models["project"].findByPk(authProject.projectId, {
			transaction,
			include: [sequelize.models["user"], sequelize.models["epic"]],
		});
		project.set(
			{
				...(projectUpdateRequest.code && { code: projectUpdateRequest.code }),
				...(projectUpdateRequest.title && { title: projectUpdateRequest.title }),
				...(projectUpdateRequest.description && { description: projectUpdateRequest.description }),
			},
			{ transaction },
		);

		await project.save({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapProjectResponse(project);
	res.status(200).send(response);
}
