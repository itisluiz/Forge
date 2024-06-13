import { ExternalHandlingError } from "../../error/externalhandling.error.js";
import { Failure } from "forge-shared/dto/failure.dto";
import { Response } from "express";
import logging from "../../util/logging.js";

export default async function (res: Response, origin: string, error: ExternalHandlingError) {
	logging.logDebug("handler", `External error in ${origin}:`, error);

	const result: Failure = {
		message: error.message,
		failuretype: error.failureType,
	};

	res.status(error.statusCode).json(result);
}
