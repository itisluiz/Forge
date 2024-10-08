import { mapPlanningpokerSelfComposite } from "../composite/planningpokerselfcomposite.mapper.js";
import { PlanningpokerSelfResponse } from "forge-shared/dto/response/planningpokerselfresponse.dto";
import { PlanningpokerSession } from "../../session/planningpoker.session.js";

export function mapPlanningpokerSelfResponse(pokerSessions: PlanningpokerSession[]): PlanningpokerSelfResponse {
	return {
		pokerSessions: pokerSessions.map(mapPlanningpokerSelfComposite),
	};
}
