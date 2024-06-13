export abstract class InternalHandlingError extends Error {
	public innerError?: Error;

	constructor(message: string, innerError?: Error) {
		super(message);
		this.innerError = innerError;
		this.name = "InternalHandlingError";
	}

	public override toString(): string {
		return !this.innerError ? super.toString() : `${super.toString()} (${this.innerError})`;
	}
}

export class MissingHandlerError extends InternalHandlingError {
	constructor(message: string, innerError?: Error) {
		super(message, innerError);
		this.name = "MissingHandlerError";
	}
}

export class ExternalServiceError extends InternalHandlingError {
	constructor(message: string, innerError?: Error) {
		super(message, innerError);
		this.name = "ExternalServiceError";
	}
}

export class DatabaseError extends InternalHandlingError {
	constructor(message: string, innerError?: Error) {
		super(message, innerError);
		this.name = "DatabaseError";
	}
}
