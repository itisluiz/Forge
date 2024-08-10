import { BadRequestError } from "../externalhandling.error.js";
import { UniqueConstraintError } from "sequelize";

export function condition(error: any) {
	return error instanceof UniqueConstraintError;
}

export function transform(error: UniqueConstraintError) {
	return new BadRequestError(`The field '${error.errors[0].path}' is already in use`);
}
