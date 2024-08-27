import { decryptPK } from "../../util/encryption.js";
import { ForbiddenError } from "../../error/externalhandling.error.js";
import { getProjectData, getUserData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapProjectResponse } from "../../mappers/response/projectresponse.mapper.js";
import { ProjectKickRequest } from "forge-shared/dto/request/projectkickrequest.dto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const projectKickRequest = req.body as ProjectKickRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authUser = getUserData(req);
	const authProject = getProjectData(req);
	const userId = decryptPK("user", projectKickRequest.eid);

	let project: any;

	try {
		if (authUser.user.dataValues.id === userId) {
			throw new ForbiddenError("You may not kick yourself from the project");
		}

		const membership: any = await sequelize.models["projectmembership"].findOne({
			where: {
				projectId: authProject.projectId,
				userId: userId,
			},
			attributes: ["projectId", "userId", "isAdmin"],
			transaction,
		});

		if (!membership) {
			throw new ForbiddenError("User not found in the project");
		}

		if (membership.dataValues.isAdmin) {
			throw new ForbiddenError("You may not kick another admin from the project");
		}

		await membership.destroy({ transaction });
		await transaction.commit();
		project = await membership.getProject({ include: [sequelize.models["user"], sequelize.models["epic"]] });
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const self = project.dataValues.users.find((user: any) => user.dataValues.id === authUser.user.dataValues.id);
	const response = mapProjectResponse(project, self);
	res.status(200).send(response);
}
