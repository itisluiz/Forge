import { ExternalHandlingError } from "../error/externalhandling.error.js";
import { MissingHandlerError } from "../error/internalhandling.error.js";
import { Response } from "express";

const handlers: any = {};

export function registerHandler(controller: string, identifier: string, handler: any) {
	handlers[controller] = handlers[controller] || {};
	handlers[controller][identifier] = handler;
}

export async function handle(controller: string, identifier: string, res: Response, ...args: any[]): Promise<void> {
	try {
		if (!handlers[controller] || !handlers[controller][identifier]) {
			throw new MissingHandlerError("Handler not found");
		}

		await handlers[controller][identifier](res, ...args);
	} catch (error) {
		const external = error instanceof ExternalHandlingError;
		const origin = `${controller}::${identifier}`;
		await handlers["error"][external ? "externalhandling" : "internalhandling"](res, origin, error);
	}
}
