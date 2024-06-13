import { Failure } from "forge-shared/dto/failure.dto";
import { FailureType } from "forge-shared/enum/failuretype.enum.js";
import { InternalHandlingError } from "../../error/internalhandling.error.js";
import { Response } from "express";
import logging from "../../util/logging.js";

export default async function (res: Response, origin: string, error: Error) {
	if (error instanceof InternalHandlingError) {
		logging.logWarn("handler", `Internal error in ${origin}:`, error);
	} else {
		logging.logError("handler", `Unexpected internal error in ${origin}:`, error);
	}

	const result: Failure = {
		message: "An internal error occurred",
		failuretype: FailureType.INTERNAL,
	};

	res.status(500).json(result);
}
