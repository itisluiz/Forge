import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapProjectInvitationsResponse } from "../../mappers/response/projectinvitationsresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let invitations: any;

	try {
		invitations = await sequelize.models["projectinvitation"].findAll({
			where: { projectId: authProject.projectId },
			transaction,
		});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapProjectInvitationsResponse(invitations);
	res.status(200).send(response);
}
