import { PlanningpokerSelfComposite } from "forge-shared/dto/composite/planningpokerselfcomposite.dto.js";
import { PlanningpokerSession } from "../../session/planningpoker.session.js";

export function mapPlanningpokerSelfComposite(pokerSession: PlanningpokerSession): PlanningpokerSelfComposite {
	return {
		sessionCode: pokerSession.sessionCode,
		agenda: pokerSession.agenda,
		userstoryCount: pokerSession.sprint.dataValues.userstories.length,
		participantCount: pokerSession.participants.length,
	};
}
