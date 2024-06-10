import { FailureType } from "forge-shared/enum/failuretype.enum";

export abstract class ExternalHandlingError extends Error {
	public failureType: FailureType;
	public statusCode: number;

	constructor(message: string, statusCode: number, failureType: FailureType) {
		super(message);
		this.failureType = failureType;
		this.statusCode = statusCode;
		this.name = "ExternalHandlingError";
	}
}

export class BadRequestError extends ExternalHandlingError {
	constructor(message: string) {
		super(message, 400, FailureType.BADREQUEST);
		this.name = "BadRequestError";
	}
}

export class UnauthorizedError extends ExternalHandlingError {
	constructor(message: string) {
		super(message, 401, FailureType.UNAUTHORIZED);
		this.name = "UnauthorizedError";
	}
}

export class NotFoundError extends ExternalHandlingError {
	constructor(message: string) {
		super(message, 404, FailureType.NOTFOUND);
		this.name = "NotFoundError";
	}
}
