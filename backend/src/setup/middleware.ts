import { Express } from "express";
import errorHandler from "../handlers/failure/error.handler.js";
import expressWs from "express-ws";

export async function setupEarlyMiddleware(app: Express) {
	expressWs(app);
}

export async function setupLateMiddleware(app: Express) {
	app.use(errorHandler);
}
