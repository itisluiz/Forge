import { encryptPK } from "../../util/encryption.js";
import { getGravatarUrl } from "../../util/gravatar.js";
import { PlanningpokerParticipant } from "../../session/planningpoker.session.js";
import { PlanningpokerParticipantComposite } from "forge-shared/dto/composite/planningpokerparticipantcomposite.dto.js";

export function mapPlanningpokerParticipantComposite(
	participant: PlanningpokerParticipant,
): PlanningpokerParticipantComposite {
	return {
		eid: encryptPK("user", participant.user.dataValues.id),
		email: participant.user.dataValues.email,
		name: participant.user.dataValues.name,
		surname: participant.user.dataValues.surname,
		gravatar: getGravatarUrl(participant.user.dataValues.email),
		vote: participant.vote,
	};
}
