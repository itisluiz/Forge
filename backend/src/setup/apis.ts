import { Express } from "express";
import { directoryImport } from "../util/importing.js";

export async function setupApis(app: Express) {
	const routers = await directoryImport("dist/apis");
	for (const name in routers) {
		app.use(routers[name].default);
	}
}
