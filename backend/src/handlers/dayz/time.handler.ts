import { Request, Response } from "express";
import { InfoResponse, queryGameServerInfo } from "steam-server-query";
import { DayZTimeResponse } from "forge-shared/dto/response/dayztimeresponse.dto";

// Cache object to store the result and timestamp
let cachedResult: { response: InfoResponse; timestamp: number } | null = null;

// Cache expiration time in milliseconds (2 minutes)
const CACHE_EXPIRATION = 2 * 60 * 1000;

export default async function (req: Request, res: Response) {
	// Check if the cache is valid
	const now = Date.now();

	let result: InfoResponse | null = null;

	if (cachedResult && now - cachedResult.timestamp < CACHE_EXPIRATION) {
		result = cachedResult.response;
	} else {
		result = await queryGameServerInfo("31.214.158.202:10101");
		cachedResult = {
			response: result,
			timestamp: now,
		};
	}

	// Send the response
	const response: DayZTimeResponse = {
		time: result.keywords?.split(",").find((keyword) => /^\d{2}:\d{2}$/.test(keyword))!,
		players: result.players,
		maxPlayers: result.maxPlayers,
	};

	res.status(200).send(response);
}
