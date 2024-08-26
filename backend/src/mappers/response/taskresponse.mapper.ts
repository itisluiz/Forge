import { encryptPK } from "../../util/encryption.js";
import { TaskResponse } from "forge-shared/dto/response/taskresponse.dto";

export function mapTaskResponse(task: any): TaskResponse {
	return {
		eid: encryptPK("task", task.dataValues.id),
		userstoryEid: encryptPK("userstory", task.dataValues.userstoryId),
		responsibleEid: encryptPK("user", task.dataValues.assignedTo),
		title: task.dataValues.title,
		description: task.dataValues.description,
		status: task.dataValues.etaskstatusId,
		type: task.dataValues.etasktypeId,
		createdAt: task.dataValues.createdAt,
		updatedAt: task.dataValues.updatedAt,
	};
}
