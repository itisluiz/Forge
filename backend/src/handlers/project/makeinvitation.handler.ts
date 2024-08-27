import { BadRequestError } from "../../error/externalhandling.error.js";
import { ForeignKeyConstraintError } from "sequelize";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapProjectMakeInvitationResponse } from "../../mappers/response/projectmakeinvitationresponse.mapper.js";
import { ProjectMakeInvitationRequest } from "forge-shared/dto/request/projectmakeinvitationrequest.dto";
import { randomBytes } from "crypto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const projectMakeInvitationRequest = req.body as ProjectMakeInvitationRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let invitation: any;

	try {
		invitation = await sequelize.models["projectinvitation"].create(
			{
				code: randomBytes(12).toString("hex"),
				remainingUses: projectMakeInvitationRequest.uses,
				durationHours: projectMakeInvitationRequest.durationHours,
				projectId: authProject.projectId,
				eprojectroleId: projectMakeInvitationRequest.role,
			},
			{
				transaction,
			},
		);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();

		if (error instanceof ForeignKeyConstraintError && error.table === "eprojectroles") {
			throw new BadRequestError("The role you specified does not exist");
		}

		throw error;
	}

	const response = mapProjectMakeInvitationResponse(invitation);
	res.status(200).send(response);
}
