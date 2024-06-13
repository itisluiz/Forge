import { Sequelize } from "sequelize";
import { directoryImport } from "../importing.js";
import logging from "../logging.js";

export async function setupSequelize(sequelize: Sequelize) {
	const models = await directoryImport("dist/models", ".model.js");
	logging.logInfo("sequelize", `Setting up ${Object.keys(models).length} model(s)`);

	for (const name in models) {
		const model = models[name];
		model.define(name, sequelize);
	}

	for (const name in models) {
		const model = models[name];
		model.associate(name, sequelize);
	}

	await sequelize.sync();
}
