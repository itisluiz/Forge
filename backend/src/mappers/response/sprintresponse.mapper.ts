import { encryptPK } from "../../util/encryption.js";
import { mapTaskSelfComposite } from "../composite/taskselfcomposite.mapper.js";
import { SprintResponse } from "forge-shared/dto/response/sprintresponse.dto";

export function mapSprintResponse(sprint: any): SprintResponse {
	return {
		eid: encryptPK("sprint", sprint.dataValues.id),
		startsAt: sprint.dataValues.startsAt,
		endsAt: sprint.dataValues.endsAt,
		status: sprint.dataValues.esprintstatusId,
		tasks: sprint.dataValues.userstories.flatMap((sprint: any) => sprint.dataValues.tasks.map(mapTaskSelfComposite)),
		createdAt: sprint.dataValues.createdAt,
		updatedAt: sprint.dataValues.updatedAt,
	};
}
