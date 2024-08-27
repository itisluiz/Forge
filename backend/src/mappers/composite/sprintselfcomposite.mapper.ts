import { encryptPK } from "../../util/encryption.js";
import { SprintSelfComposite } from "forge-shared/dto/composite/sprintselfcomposite.dto";

export function mapSprintSelfComposite(sprint: any, index: number): SprintSelfComposite {
	return {
		eid: encryptPK("sprint", sprint.dataValues.id),
		index: index + 1,
		startsAt: sprint.dataValues.startsAt,
		endsAt: sprint.dataValues.endsAt,
		status: sprint.dataValues.esprintstatusId,
	};
}
