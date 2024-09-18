import { Express } from "express";
import errorHandler from "../handlers/failure/error.handler.js";

export async function setupEarlyMiddleware(app: Express) {}

export async function setupLateMiddleware(app: Express) {
	app.use(errorHandler);
}
