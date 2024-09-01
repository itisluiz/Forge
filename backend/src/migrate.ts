import { exec } from "child_process";
import { getSequelize } from "./util/sequelize.js";
import { promisify } from "util";
import chalk from "chalk";
import logging from "./util/logging.js";

const isProduction = process.env["NODE_ENV"] === "production";

if (isProduction) {
	logging.logInfo("migrations", "Preparing to migrate the", chalk.red("production"), "environment");
} else {
	logging.logInfo("migrations", "Preparing to migrate the", chalk.cyanBright("development"), "environment");
}

const sequelize = await getSequelize();
await sequelize.sync({ force: true });
await sequelize.close();

try {
	await promisify(exec)(`npx sequelize db:seed:all --env ${process.env["NODE_ENV"]}`);
	logging.logSuccess("migrations", "Database seeded successfully");
} catch (error) {
	logging.logError("migrations", "Failed to seed the database:", error);
}
