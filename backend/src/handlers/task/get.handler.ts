import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapTaskResponse } from "../../mappers/response/taskresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const taskId = decryptPK("task", req.params["taskEid"]);

	let task: any;

	try {
		task = await sequelize.models["task"].findOne({
			where: {
				id: taskId,
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

		if (!task || !task.dataValues.userstory) {
			throw new BadRequestError("Task not found in the project");
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapTaskResponse(task, authProject.project.dataValues.code);
	res.status(200).send(response);
}
