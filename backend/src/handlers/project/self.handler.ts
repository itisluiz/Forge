import { getSequelize } from "../../util/sequelize.js";
import { Request, Response } from "express";
import { getUserData } from "../../util/requestmeta.js";
import { mapProjectSelfResponse } from "../../mappers/response/projectselfresponse.mapper.js";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authUser = getUserData(req);

	let projects: any;

	try {
		projects = await authUser.user.getProjects();
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapProjectSelfResponse(projects);
	res.status(200).send(response);
}
