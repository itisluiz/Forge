import { encryptPK } from "../../util/encryption.js";
import { mapPlanningpokerParticipantComposite } from "../composite/planningpokerparticipantcomposite.mapper.js";
import { mapSprintSelfComposite } from "../composite/sprintselfcomposite.mapper.js";
import { mapUserstorySelfComposite } from "../composite/userstoryselfcomposite.mapper.js";
import { PlanningpokerResponse } from "forge-shared/dto/response/planningpokerresponse.dto.js";
import { PlanningpokerSession } from "../../session/planningpoker.session.js";

export function mapPlanningpokerResponse(pokerSession: PlanningpokerSession): PlanningpokerResponse {
	return {
		agenda: pokerSession.agenda,
		sprint: mapSprintSelfComposite(pokerSession.sprint),
		userstories: pokerSession.sprint.dataValues.userstories.map((userstory: any) =>
			mapUserstorySelfComposite(userstory, pokerSession.project.dataValues.code),
		),
		participants: pokerSession.participants.map(mapPlanningpokerParticipantComposite),
		selectedUserstoryEid: encryptPK("userstory", pokerSession.selectedUserstoryId!),
		revealed: pokerSession.revealed,
		voteAverage: pokerSession.voteAverage,
		voteClosestFibonacci: pokerSession.voteClosestFibonacci,
	};
}
