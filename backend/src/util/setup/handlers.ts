import { directoryNestedImport } from "../importing.js";
import { registerHandler } from "../handle.js";

export async function setupHandlers() {
	const handlers = await directoryNestedImport("dist/handlers", ".handler.js");
	for (const controller in handlers) {
		for (const identifier in handlers[controller]) {
			registerHandler(controller, identifier, handlers[controller][identifier].default);
		}
	}
}
