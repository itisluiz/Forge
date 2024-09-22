import { ForbiddenError, NotFoundError } from "../../error/externalhandling.error.js";
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

	const userstory = pokerSession.sprint.dataValues.userstories.find(
		(userstory: any) => userstory.dataValues.id === pokerSession.selectedUserstoryId,
	);
	if (!userstory) {
		throw new NotFoundError("The selected userstory does not exist in the sprint");
	}

	try {
		await userstory.set(
			{
				effortScore: vote,
			},
			{ transaction },
		);

		await userstory.save({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	res.status(200).send();
}
