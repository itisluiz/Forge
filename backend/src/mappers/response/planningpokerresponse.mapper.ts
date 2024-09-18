import { encryptPK } from "../../util/encryption.js";
import { mapPlanningpokerParticipantComposite } from "../composite/planningpokerparticipantcomposite.mapper.js";
import { mapTaskSelfComposite } from "../composite/taskselfcomposite.mapper.js";
import { mapUserstorySelfComposite } from "../composite/userstoryselfcomposite.mapper.js";
import { PlanningpokerResponse } from "forge-shared/dto/response/planningpokerresponse.dto.js";
import { PlanningpokerSession } from "../../session/planningpoker.session.js";

export function mapPlanningpokerResponse(pokerSession: PlanningpokerSession): PlanningpokerResponse {
	return {
		agenda: pokerSession.agenda,
		userstories: pokerSession.userstories.map((userstory: any) =>
			mapUserstorySelfComposite(userstory, pokerSession.project.dataValues.code),
		),
		tasks: pokerSession.userstories
			.flatMap((userstory: any) => userstory.dataValues.tasks)
			.map((task: any) => mapTaskSelfComposite(task, pokerSession.project.dataValues.code)),
		participants: pokerSession.participants.map(mapPlanningpokerParticipantComposite),
		selectedTaskEid: encryptPK("task", pokerSession.selectedTaskId!),
		revealed: pokerSession.revealed,
		voteAverage: pokerSession.voteAverage,
		voteClosestFibonacci: pokerSession.voteClosestFibonacci,
	};
}
