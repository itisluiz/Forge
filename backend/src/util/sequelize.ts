import logging from "../util/logging.js";
import { Sequelize } from "sequelize";
import { setupSequelize } from "../util/setup/sequelize.js";

let sequelize: Sequelize | null = null;

export async function closeSequelize() {
	if (sequelize) {
		await sequelize.close();
		sequelize = null;
		logging.logInfo("sequelize", "Connection closed");
	}
}

export async function getSequelize(forceRenew = false) {
	if (sequelize && !forceRenew) {
		return sequelize;
	}

	await closeSequelize();

	sequelize = new Sequelize({
		database: process.env["DB_NAME"],
		username: process.env["DB_USER"],
		password: process.env["DB_PASS"],
		host: process.env["DB_HOST"],
		port: process.env["DB_PORT"] ? parseInt(process.env["DB_PORT"]) : undefined,
		dialect: "mariadb",
		logging: (what) => logging.logDebug("sequelize", what),
	});

	logging.logInfo("sequelize", "Connecting to the database", sequelize.getDatabaseName());

	try {
		await sequelize.authenticate();
		logging.logInfo("sequelize", "Successfully connected");
		await setupSequelize(sequelize);
	} catch (error) {
		await closeSequelize();
		logging.logError("sequelize", "Failed to connect:", error);
	}

	return sequelize;
}
