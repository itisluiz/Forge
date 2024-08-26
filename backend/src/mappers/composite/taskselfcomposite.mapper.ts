import { encryptPK } from "../../util/encryption.js";
import { TaskSelfComposite } from "forge-shared/dto/composite/taskselfcomposite.dto";

export function mapTaskSelfComposite(task: any): TaskSelfComposite {
	return {
		eid: encryptPK("task", task.dataValues.id),
		userstoryEid: encryptPK("userstory", task.dataValues.userstoryId),
		responsibleEid: encryptPK("user", task.dataValues.assignedTo),
		title: task.dataValues.title,
		status: task.dataValues.etaskstatusId,
		type: task.dataValues.etasktypeId,
	};
}
