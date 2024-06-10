import { directoryImport } from "../util/importing.js";
import { Express } from "express";

export async function setupControllers(app: Express) {
	const routers = await directoryImport("dist/controllers", ".controller.js");
	for (const name in routers) {
		app.use(routers[name].default);
	}
}
