import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { ForeignKeyConstraintError, Op } from "sequelize";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapTaskResponse } from "../../mappers/response/taskresponse.mapper.js";
import { Request, Response } from "express";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum.js";
import { TaskUpdateRequest } from "forge-shared/dto/request/taskupdaterequest.dto";

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
						{
							model: sequelize.models["sprint"],
							attributes: ["startsAt", "endsAt"],
						},
						{
							model: sequelize.models["task"],
							where: { id: { [Op.not]: taskId } },
							attributes: ["complexity"],
						},
					],
					attributes: ["effortScore"],
				},
			],
			transaction,
		});

		if (!task || !task.dataValues.userstory) {
			throw new BadRequestError("Task not found in the project");
		}

		const userstory = task.dataValues.userstory;
		const sprint = userstory.dataValues.sprint;

		const resStatus = taskUpdateRequest.status || (task.dataValues.etaskstatusId as TaskStatus);
		const resComplexity = taskUpdateRequest.complexity || (task.dataValues.complexity as number | null);

		if (resStatus !== TaskStatus.TODO && resComplexity === null) {
			throw new BadRequestError("The complexity of the task must be specified before changing the status");
		}

		if (!userstory.dataValues.effortScore && resComplexity !== null) {
			throw new BadRequestError("The user story effort score must be specified before changing the task complexity");
		}

		const resTaskComplexity = userstory.dataValues.tasks.reduce(
			(acc: number, t: any) => acc + (t.dataValues.complexity ?? 0),
			resComplexity,
		);

		if (resTaskComplexity > userstory.dataValues.effortScore) {
			throw new BadRequestError("The sum of the task complexities cannot exceed the user story effort score");
		}

		let resStartedAt =
			(taskUpdateRequest.startedAt ? new Date(taskUpdateRequest.startedAt) : null) ||
			(task.dataValues.startedAt as Date | null);

		let resCompletedAt =
			(taskUpdateRequest.completedAt ? new Date(taskUpdateRequest.completedAt) : null) ||
			(task.dataValues.completedAt as Date | null);

		switch (resStatus) {
			case TaskStatus.TODO:
				resStartedAt = null;
				resCompletedAt = null;
				break;
			case TaskStatus.INPROGRESS:
			case TaskStatus.AVAILABLETOREVIEW:
			case TaskStatus.REVIEWING:
				resCompletedAt = null;
				resStartedAt ??= new Date();
				break;
			case TaskStatus.DONE:
			case TaskStatus.CANCELLED:
				resCompletedAt ??= new Date();
				resStartedAt ??= resCompletedAt;
				break;
		}

		if (sprint) {
			resStartedAt = sprint.capDate(resStartedAt);
			resCompletedAt = sprint.capDate(resCompletedAt);
		}

		if (resStartedAt && resCompletedAt && resStartedAt > resCompletedAt) {
			throw new BadRequestError("The completion date must be later than the start date");
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
				startedAt: resStartedAt,
				completedAt: resCompletedAt,
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
