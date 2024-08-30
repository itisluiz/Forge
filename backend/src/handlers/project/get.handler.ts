import { getProjectData, getUserData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapProjectResponse } from "../../mappers/response/projectresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authUser = getUserData(req);
	const authProject = getProjectData(req);

	let project: any;

	try {
		project = await sequelize.models["project"].findByPk(authProject.project.dataValues.id, {
			transaction,
			include: [sequelize.models["user"], sequelize.models["epic"]],
		});
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const self = project.dataValues.users.find((user: any) => user.dataValues.id === authUser.user.dataValues.id);
	const response = mapProjectResponse(project, self);
	res.status(200).send(response);
}
