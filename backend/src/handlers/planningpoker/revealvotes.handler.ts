import { ForbiddenError } from "../../error/externalhandling.error.js";
import { getPlanningpokerData } from "../../util/requestmeta.js";
import { Request, Response } from "express";

const fibonacciValues = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

export default async function (req: Request, res: Response) {
	const pokerSession = getPlanningpokerData(req);

	if (pokerSession.participants.every((participant) => participant.vote === undefined)) {
		throw new ForbiddenError("No votes have been cast yet");
	}

	const votes = pokerSession.participants.map((participant) => participant.vote);
	const numericalVotes = votes.filter((vote) => vote) as number[];
	const numericalVotesAverage = numericalVotes.length
		? numericalVotes.reduce((acc, vote) => acc + vote, 0) / numericalVotes.length
		: null;
	const closestFibonacciValue = numericalVotesAverage
		? fibonacciValues.reduce((prev, curr) =>
				Math.abs(curr - numericalVotesAverage) < Math.abs(prev - numericalVotesAverage) ? curr : prev,
			)
		: null;

	pokerSession.revealed = true;
	pokerSession.voteAverage = numericalVotesAverage ? Math.round(numericalVotesAverage * 10) / 10 : null;
	pokerSession.voteClosestFibonacci = closestFibonacciValue;
	res.status(200).send();
}
