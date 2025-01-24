import { Request, Response } from "express";
import { queryGameServerInfo } from "steam-server-query";
import { ExternalServiceError } from "../../error/internalhandling.error.js";
import { DayZTimeResponse } from "forge-shared/dto/response/dayztimeresponse.dto";

// Cache object to store the result and timestamp
let cachedResult: { time: string; timestamp: number } | null = null;

// Cache expiration time in milliseconds (3 minutes)
const CACHE_EXPIRATION = 3 * 60 * 1000;

export default async function (req: Request, res: Response) {
	// Check if the cache is valid
	const now = Date.now();
	if (cachedResult && now - cachedResult.timestamp < CACHE_EXPIRATION) {
		// Return the cached result
		const response: DayZTimeResponse = { time: cachedResult.time };
		res.status(200).send(response);
		return;
	}

	// Fetch new data
	let result = await queryGameServerInfo("31.214.158.196:10801");
	const time = result.keywords?.split(",").find((keyword) => /^\d{2}:\d{2}$/.test(keyword));

	if (!time) {
		throw new ExternalServiceError("Failed to fetch server time");
	}

	// Update the cache
	cachedResult = {
		time,
		timestamp: now,
	};

	// Send the response
	const response: DayZTimeResponse = { time };
	res.status(200).send(response);
}
