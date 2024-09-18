import { decryptPK } from "../../util/encryption.js";
import { getPlanningpokerData } from "../../util/requestmeta.js";
import { NotFoundError } from "../../error/externalhandling.error.js";
import { PlanningpokerSettaskRequest } from "forge-shared/dto/request/planningpokersettaskrequest.dto.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const planningpokerSettaskRequest = req.body as PlanningpokerSettaskRequest;
	const pokerSession = getPlanningpokerData(req);

	const taskId = decryptPK("task", planningpokerSettaskRequest.taskEid);
	const tasks = pokerSession.userstories.flatMap((userstory) => userstory.dataValues.tasks);

	if (!tasks.some((task) => task.id === taskId)) {
		throw new NotFoundError("Task not found in the planning poker session");
	}

	pokerSession.participants.forEach((participant) => {
		participant.vote = undefined;
	});
	pokerSession.selectedTaskId = taskId;
	pokerSession.revealed = false;
	pokerSession.voteAverage = undefined;
	pokerSession.voteClosestFibonacci = undefined;
	res.status(200).send();
}
