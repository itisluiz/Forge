import bodyParser from "body-parser";
import { Express } from "express";

export async function setupMiddleware(app: Express) {
	app.use(bodyParser.json());
}
