import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { ForeignKeyConstraintError } from "sequelize";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapTaskResponse } from "../../mappers/response/taskresponse.mapper.js";
import { Request, Response } from "express";
import { TaskNewRequest } from "forge-shared/dto/request/tasknewrequest.dto";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum.js";

export default async function (req: Request, res: Response) {
	const taskNewRequest = req.body as TaskNewRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let task: any;

	try {
		let responsibleId: number | null = null;
		if (taskNewRequest.responsibleEid) {
			responsibleId = decryptPK("user", taskNewRequest.responsibleEid);
			const membership = await sequelize.models["projectmembership"].findOne({
				where: { userId: responsibleId, projectId: authProject.project.dataValues.id },
				attributes: ["userId"],
				transaction,
			});
			if (!membership) {
				throw new BadRequestError("The specified user was not found in the project");
			}
		}

		const userstoryId = decryptPK("userstory", taskNewRequest.userstoryEid);
		const userstory = await sequelize.models["userstory"].findOne({
			where: { id: userstoryId },
			include: {
				model: sequelize.models["epic"],
				attributes: ["projectId"],
				where: { projectId: authProject.project.dataValues.id },
			},
			transaction,
		});
		if (!userstory) {
			throw new BadRequestError("The user story you specified does not exist in the project");
		}

		task = await sequelize.models["task"].create(
			{
				userstoryId: userstoryId,
				assignedTo: responsibleId,
				index: authProject.project.dataValues.taskIndex,
				title: taskNewRequest.title,
				description: taskNewRequest.description,
				etaskstatusId: TaskStatus.TODO,
				etasktypeId: taskNewRequest.type,
				epriorityId: taskNewRequest.priority,
			},
			{ transaction },
		);

		await authProject.project.increment("taskIndex", { transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();

		if (error instanceof ForeignKeyConstraintError && error.table === "etaskstatuses") {
			throw new BadRequestError("The status you specified does not exist");
		}

		if (error instanceof ForeignKeyConstraintError && error.table === "etasktypes") {
			throw new BadRequestError("The task type you specified does not exist");
		}

		if (error instanceof ForeignKeyConstraintError && error.table === "epriorities") {
			throw new BadRequestError("The priority you specified does not exist");
		}

		throw error;
	}

	const response = mapTaskResponse(task, authProject.project.dataValues.code);
	res.status(200).send(response);
}
