import { ForbiddenError } from "../../error/externalhandling.error.js";
import { getProjectData, getUserData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { Op } from "sequelize";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authUser = getUserData(req);
	const authProject = getProjectData(req);

	try {
		if (authProject.projectAdmin) {
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
				throw new ForbiddenError("You may not leave the project as the only admin");
			}
		}

		await sequelize.models["projectmembership"].destroy({
			where: {
				projectId: authProject.projectId,
				userId: authUser.user.dataValues.id,
			},
			transaction,
		});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	res.status(200).send();
}
