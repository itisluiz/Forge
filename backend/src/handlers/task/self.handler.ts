import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapTaskSelfResponse } from "../../mappers/response/taskselfresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const userstoryId = decryptPK("userstory", req.params["userstoryEid"]);

	let tasks: any;

	try {
		tasks = await sequelize.models["task"].findAll({
			where: {
				userstoryId: userstoryId,
			},
			include: [
				{
					model: sequelize.models["userstory"],
					include: [
						{
							model: sequelize.models["epic"],
							where: { projectId: authProject.project.dataValues.id },
							attributes: ["projectId"],
						},
					],
					attributes: ["epicId"],
				},
			],
			transaction,
		});

		tasks = tasks.filter((task: any) => task.dataValues.userstory);
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapTaskSelfResponse(tasks);
	res.status(200).send(response);
}
