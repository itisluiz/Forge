import { MissingHandlerError } from "../error/internalhandling.error.js";
import { Request, Response } from "express";

const handlers: any = {};

export function registerHandler(controller: string, identifier: string, handler: any) {
	handlers[controller] = handlers[controller] || {};
	handlers[controller][identifier] = handler;
}

export async function handle(controller: string, identifier: string, req: Request, res: Response): Promise<void> {
	try {
		if (!handlers[controller] || !handlers[controller][identifier]) {
			throw new MissingHandlerError("Handler not found");
		}

		await handlers[controller][identifier](req, res);
	} catch (error) {
		await handlers["failure"]["error"](error, req, res);
	}
}
