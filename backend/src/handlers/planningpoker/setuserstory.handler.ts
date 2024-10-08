import { decryptPK } from "../../util/encryption.js";
import { getPlanningpokerData } from "../../util/requestmeta.js";
import { NotFoundError } from "../../error/externalhandling.error.js";
import { PlanningpokerSetuserstoryRequest } from "forge-shared/dto/request/planningpokersetuserstoryrequest.dto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const planningpokerSetuserstoryRequest = req.body as PlanningpokerSetuserstoryRequest;
	const pokerSession = getPlanningpokerData(req);

	const userstoryId = decryptPK("userstory", planningpokerSetuserstoryRequest.userstoryEid);
	const userstories = pokerSession.sprint.dataValues.userstories;

	if (!userstories.some((userstory: any) => userstory.dataValues.id === userstoryId)) {
		throw new NotFoundError("Userstory not found in the planning poker session");
	}

	pokerSession.participants.forEach((participant) => {
		participant.vote = undefined;
	});
	pokerSession.selectedUserstoryId = userstoryId;
	pokerSession.revealed = false;
	pokerSession.voteAverage = undefined;
	pokerSession.voteClosestFibonacci = undefined;
	res.status(200).send();
}
