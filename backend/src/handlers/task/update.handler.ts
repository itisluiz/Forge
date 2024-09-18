import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { ForeignKeyConstraintError } from "sequelize";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapTaskResponse } from "../../mappers/response/taskresponse.mapper.js";
import { Request, Response } from "express";
import { TaskUpdateRequest } from "forge-shared/dto/request/taskupdaterequest.dto";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum.js";

export default async function (req: Request, res: Response) {
	const taskUpdateRequest = req.body as TaskUpdateRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const taskId = decryptPK("task", req.params["taskEid"]);

	let task: any;

	try {
		let responsibleId: number | null = null;
		if (taskUpdateRequest.responsibleEid) {
			responsibleId = decryptPK("user", taskUpdateRequest.responsibleEid);

			const membership = await sequelize.models["projectmembership"].findOne({
				where: { userId: responsibleId, projectId: authProject.project.dataValues.id },
				attributes: ["userId"],
				transaction,
			});
			if (!membership) {
				throw new BadRequestError("The specified user was not found in the project");
			}
		}

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

		let startedAt: Date | null | undefined = taskUpdateRequest.startedAt
			? new Date(taskUpdateRequest.startedAt)
			: (taskUpdateRequest.startedAt as null | undefined);
		let completedAt: Date | null | undefined = taskUpdateRequest.completedAt
			? new Date(taskUpdateRequest.completedAt)
			: (taskUpdateRequest.completedAt as null | undefined);

		switch (taskUpdateRequest.status) {
			case TaskStatus.TODO:
				startedAt = startedAt ?? null;
				completedAt = completedAt ?? null;
				break;
			case TaskStatus.INPROGRESS:
			case TaskStatus.AVAILABLETOREVIEW:
			case TaskStatus.REVIEWING:
				completedAt = completedAt ?? null;
				if (!task.dataValues.startedAt) {
					startedAt = startedAt ?? new Date();
				}
				break;
			case TaskStatus.DONE:
			case TaskStatus.CANCELLED:
				if (!task.dataValues.completedAt) {
					completedAt = completedAt ?? new Date();
				}
				if (!task.dataValues.startedAt) {
					startedAt = startedAt ?? completedAt;
				}
				break;
		}

		let newStartedAt = startedAt === undefined ? task.dataValues.startedAt : startedAt;
		let newCompletedAt = completedAt === undefined ? task.dataValues.completedAt : completedAt;
		if ((!newStartedAt && newCompletedAt) || (newStartedAt && newCompletedAt && newStartedAt > newCompletedAt)) {
			throw new BadRequestError("The start/completion interval is invalid");
		}

		task.set(
			{
				...(taskUpdateRequest.responsibleEid !== undefined && { assignedTo: responsibleId }),
				...(taskUpdateRequest.title && { title: taskUpdateRequest.title }),
				...(taskUpdateRequest.description && { description: taskUpdateRequest.description }),
				...(taskUpdateRequest.status && { etaskstatusId: taskUpdateRequest.status }),
				...(taskUpdateRequest.type && { etasktypeId: taskUpdateRequest.type }),
				...(taskUpdateRequest.priority && { epriorityId: taskUpdateRequest.priority }),
				...(taskUpdateRequest.complexity !== undefined && { complexity: taskUpdateRequest.complexity }),
				...(startedAt !== undefined && { startedAt: startedAt }),
				...(completedAt !== undefined && { completedAt: completedAt }),
			},
			{ transaction },
		);

		await task.save({ transaction });
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
