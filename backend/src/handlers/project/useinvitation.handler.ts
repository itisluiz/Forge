import { BadRequestError, ForbiddenError } from "../../error/externalhandling.error.js";
import { getSequelize } from "../../util/sequelize.js";
import { getUserData } from "../../util/requestmeta.js";
import { mapProjectResponse } from "../../mappers/response/projectresponse.mapper.js";
import { ProjectUseInvitationRequest } from "forge-shared/dto/request/projectuseinvitationrequest.dto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const projectUseUnvitationRequest = req.body as ProjectUseInvitationRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authUser = getUserData(req);

	let project: any;

	try {
		const invitation: any = await sequelize.models["projectinvitation"].findByPk(projectUseUnvitationRequest.code, {
			transaction,
		});

		if (!invitation) {
			throw new BadRequestError("Invalid invitation code");
		}

		if (invitation.dataValues.remainingUses <= 0 || invitation.isExpired()) {
			throw new ForbiddenError("Invitation already expired");
		}

		project = await invitation.getProject({ include: [sequelize.models["user"], sequelize.models["epic"]] });
		if (project.dataValues.users.find((user: any) => user.dataValues.id === authUser.user.dataValues.id)) {
			throw new ForbiddenError("User already in project");
		}

		await invitation.decrement("remainingUses", { transaction });

		await project.addUser(authUser.user, {
			transaction,
			through: { eprojectroleId: invitation.dataValues.eprojectroleId },
		});

		await transaction.commit();
		await project.reload();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const self = project.dataValues.users.find((user: any) => user.dataValues.id === authUser.user.dataValues.id);
	const response = mapProjectResponse(project, self);
	res.status(200).send(response);
}
