import { encryptPK } from "../../util/encryption.js";
import { SprintSelfComposite } from "forge-shared/dto/composite/sprintselfcomposite.dto";

export function mapSprintSelfComposite(sprint: any, index?: number): SprintSelfComposite {
	return {
		eid: encryptPK("sprint", sprint.dataValues.id),
		index: index !== undefined ? index + 1 : undefined,
		startsAt: sprint.dataValues.startsAt,
		endsAt: sprint.dataValues.endsAt,
		status: sprint.dataValues.esprintstatusId,
		periodStatus: sprint.getPeriodStatus(),
		targetVelocity: sprint.dataValues.targetVelocity,
	};
}
