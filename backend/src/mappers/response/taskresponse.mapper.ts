import { encryptPK } from "../../util/encryption.js";
import { TaskResponse } from "forge-shared/dto/response/taskresponse.dto";

export function mapTaskResponse(task: any, projectCode: string): TaskResponse {
	return {
		eid: encryptPK("task", task.dataValues.id),
		userstoryEid: encryptPK("userstory", task.dataValues.userstoryId),
		responsibleEid: encryptPK("user", task.dataValues.assignedTo),
		code: `${projectCode}-TSK-${task.dataValues.index}`,
		title: task.dataValues.title,
		description: task.dataValues.description,
		status: task.dataValues.etaskstatusId,
		type: task.dataValues.etasktypeId,
		priority: task.dataValues.epriorityId,
		startedAt: task.dataValues.startedAt,
		completedAt: task.dataValues.completedAt,
		complexity: task.dataValues.complexity,
		createdAt: task.dataValues.createdAt,
		updatedAt: task.dataValues.updatedAt,
	};
}
