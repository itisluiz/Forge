import { encryptPK } from "../../util/encryption.js";
import { TaskSelfComposite } from "forge-shared/dto/composite/taskselfcomposite.dto";

export function mapTaskSelfComposite(task: any, projectCode: string): TaskSelfComposite {
	return {
		eid: encryptPK("task", task.dataValues.id),
		userstoryEid: encryptPK("userstory", task.dataValues.userstoryId),
		responsibleEid: encryptPK("user", task.dataValues.assignedTo),
		code: `${projectCode}-TSK-${task.dataValues.index}`,
		title: task.dataValues.title,
		description: task.dataValues.description,
		status: task.dataValues.etaskstatusId,
		type: task.dataValues.etasktypeId,
		createdAt: task.dataValues.createdAt,
	};
}
