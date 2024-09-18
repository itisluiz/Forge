import { ForbiddenError } from "../../error/externalhandling.error.js";
import { getPlanningpokerData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { PlanningpokerVoteRequest } from "forge-shared/dto/request/planningpokervoterequest.dto.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const planningpokerVoteRequest = req.body as PlanningpokerVoteRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const pokerSession = getPlanningpokerData(req);

	if (!pokerSession.revealed) {
		throw new ForbiddenError("Can't save the result before the votes have been revealed");
	}

	const vote = (planningpokerVoteRequest.vote || pokerSession.voteClosestFibonacci) as number;
	if (!vote) {
		throw new ForbiddenError("Neither the current voting result or the provided value is a numerical value");
	}

	const task = pokerSession.userstories
		.flatMap((userstory) => userstory.dataValues.tasks)
		.find((task) => task.id === pokerSession.selectedTaskId);

	try {
		await task.set(
			{
				complexity: vote,
			},
			{ transaction },
		);

		await task.save({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	res.status(200).send();
}
