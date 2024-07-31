import { errorTransform } from "../../util/errortransform.js";
import { ExternalHandlingError } from "../../error/externalhandling.error.js";
import { FailureResponse } from "forge-shared/dto/response/failureresponse.dto";
import { FailureType } from "forge-shared/enum/failuretype.enum";
import { InternalHandlingError } from "../../error/internalhandling.error.js";
import { Request, Response, NextFunction } from "express";
import logging from "../../util/logging.js";

export default async function (err: any, req: Request, res: Response, next: NextFunction) {
	let result: FailureResponse = { message: "An internal error occurred", failureType: FailureType.INTERNAL };
	res.status(500);

	err = errorTransform(err);

	if (err instanceof ExternalHandlingError) {
		logging.logDebug("request", `External handling error (${req.path}):`, err);
		result = { message: err.message, failureType: err.failureType };
		res.status(err.statusCode);
	} else if (err instanceof InternalHandlingError) {
		logging.logWarn("request", `Internal handling error (${req.path}):`, err);
	} else {
		logging.logError("request", `Unexpected internal error (${req.path}):`, err);
	}

	res.json(result);
}
