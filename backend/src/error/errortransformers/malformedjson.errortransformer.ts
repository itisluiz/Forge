import { BadRequestError } from "../externalhandling.error.js";

export function condition(error: any) {
	return error instanceof SyntaxError && (error as any).type == "entity.parse.failed";
}

export function transform(error: SyntaxError) {
	return new BadRequestError(`Malformed JSON in request: ${error.message}`);
}
