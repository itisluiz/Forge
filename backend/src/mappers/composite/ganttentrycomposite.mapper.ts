import { encryptPK } from "../../util/encryption.js";
import { GanttEntryComposite } from "forge-shared/dto/composite/ganttentrycomposite.dto";

export function mapGanttEntryComposite(task: any, projectCode: string): GanttEntryComposite {
	return {
		taskEid: encryptPK("task", task.dataValues.id),
		taskCode: `${projectCode}-TSK-${task.dataValues.index}`,
		startedAt: task.dataValues.startedAt,
		completedAt: task.dataValues.completedAt,
	};
}
