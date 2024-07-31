import { BadRequestError } from "../error/externalhandling.error.js";
import { NextFunction, Request, Response } from "express";
import { validate } from "jsonschema";
import bodyParser from "body-parser";

export function jsonBody() {
	return bodyParser.json();
}

export function jsonBodySchema(schema: any) {
	return (req: Request, res: Response, next: NextFunction) => {
		const validationResult = validate(req.body, schema);
		if (!validationResult.valid) {
			throw new BadRequestError(`Bad JSON schema: ${validationResult.errors[0]}`);
		}

		next();
	};
}
