import "./util/environment.js";
import express from "express";
import logging from "./util/logging.js";
import chalk from "chalk";
import { setupSwagger } from "./setup/swagger.js";
import { setupControllers } from "./setup/apis.js";
import { setupFrontend } from "./setup/frontend.js";
import { getSequelize } from "./util/sequelize.js";
import { setupMiddleware } from "./setup/middleware.js";

const app = express();

setupMiddleware(app);

await setupControllers(app);

if (process.env["NODE_ENV"] === "production") {
	logging.logInfo("startup", "Server is running on the", chalk.red("production"), "environment");
	setupFrontend(app);
} else {
	logging.logInfo("startup", "Server is running on the", chalk.cyanBright("development"), "environment");
	setupSwagger(app);
}

// Pre-cache the database connection
await getSequelize();

app.listen(process.env["PORT"], () => {
	logging.logSuccess("startup", `Server started on http://localhost:${process.env["PORT"]}`);
});
