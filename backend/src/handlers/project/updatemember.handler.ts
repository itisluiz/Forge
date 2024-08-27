import { BadRequestError, ForbiddenError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { ForeignKeyConstraintError, Op } from "sequelize";
import { getProjectData, getUserData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapProjectResponse } from "../../mappers/response/projectresponse.mapper.js";
import { ProjectUpdateMemberRequest } from "forge-shared/dto/request/projectupdatememberrequest.dto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const projectUpdateMemberRequest = req.body as ProjectUpdateMemberRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authUser = getUserData(req);
	const authProject = getProjectData(req);

	let project: any;

	try {
		const membership: any = await sequelize.models["projectmembership"].findOne({
			where: {
				projectId: authProject.projectId,
				userId: decryptPK("user", projectUpdateMemberRequest.eid),
			},
			attributes: ["projectId", "userId"],
			transaction,
		});

		if (!membership) {
			throw new BadRequestError("User doesn't exist or isn't in the project");
		}

		if (projectUpdateMemberRequest.admin === false) {
			if (membership.dataValues.userId !== authUser.user.dataValues.id) {
				throw new ForbiddenError("You may only remove the admin flag from yourself");
			}

			const anotherAdminMembership: any = await sequelize.models["projectmembership"].findOne({
				where: {
					projectId: authProject.projectId,
					userId: { [Op.ne]: authUser.user.dataValues.id },
					isAdmin: true,
				},
				attributes: ["userId"],
				transaction,
			});

			if (!anotherAdminMembership) {
				throw new ForbiddenError("You may not remove the admin flag from yourself as the only admin");
			}
		}

		membership.set(
			{
				...(projectUpdateMemberRequest.role && { eprojectroleId: projectUpdateMemberRequest.role }),
				...(projectUpdateMemberRequest.admin !== undefined && { isAdmin: projectUpdateMemberRequest.admin }),
			},
			{ transaction },
		);

		await membership.save({ transaction });
		await transaction.commit();
		project = await membership.getProject({ include: [sequelize.models["user"], sequelize.models["epic"]] });
	} catch (error) {
		await transaction.rollback();

		if (error instanceof ForeignKeyConstraintError && error.table === "eprojectroles") {
			throw new BadRequestError("The role you specified does not exist");
		}

		throw error;
	}

	const response = mapProjectResponse(project);
	res.status(200).send(response);
}
