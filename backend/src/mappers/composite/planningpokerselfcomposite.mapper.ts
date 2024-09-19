import { PlanningpokerSelfComposite } from "forge-shared/dto/composite/planningpokerselfcomposite.dto.js";
import { PlanningpokerSession } from "../../session/planningpoker.session.js";

export function mapPlanningpokerSelfComposite(pokerSession: PlanningpokerSession): PlanningpokerSelfComposite {
	return {
		sessionCode: pokerSession.sessionCode,
		agenda: pokerSession.agenda,
		taskCount: pokerSession.userstories.flatMap((userstory) => userstory.dataValues.tasks).length,
		participantCount: pokerSession.participants.length,
	};
}
