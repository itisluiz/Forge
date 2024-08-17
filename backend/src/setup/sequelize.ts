import { Sequelize } from "sequelize";
import { directoryImport } from "../util/importing.js";
import logging from "../util/logging.js";

export async function setupSequelize(sequelize: Sequelize) {
	const models = await directoryImport("dist/models", ".model.js");
	logging.logInfo("sequelize", `Setting up ${Object.keys(models).length} model(s)`);

	const reservedIdentifiers = ["define", "associate"];

	for (const name in models) {
		const model = models[name];
		model.define(name, sequelize);
	}

	for (const name in models) {
		const model = models[name];
		model.associate(name, sequelize);

		for (const method in model) {
			if (!reservedIdentifiers.includes(method)) {
				(sequelize.models[name] as any).prototype[method] = model[method];
			}
		}
	}

	await sequelize.sync();
}
