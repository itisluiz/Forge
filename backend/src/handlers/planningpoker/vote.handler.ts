import { ForbiddenError, NotFoundError } from "../../error/externalhandling.error.js";
import { getPlanningpokerData, getUserData } from "../../util/requestmeta.js";
import { PlanningpokerVoteRequest } from "forge-shared/dto/request/planningpokervoterequest.dto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const planningpokerSettaskRequest = req.body as PlanningpokerVoteRequest;
	const authUser = getUserData(req);
	const pokerSession = getPlanningpokerData(req);

	if (!pokerSession.selectedTaskId) {
		throw new ForbiddenError("You can't vote before a task has been selected");
	}

	if (pokerSession.revealed) {
		throw new ForbiddenError("The votes have already been revealed, you can't vote at this time");
	}

	const user = pokerSession.participants.find(
		(participant) => participant.user.dataValues.id === authUser.user.dataValues.id,
	);
	if (!user) {
		throw new NotFoundError("User not found in the planning poker session");
	}

	user.vote = planningpokerSettaskRequest.vote;
	res.status(200).send();
}
