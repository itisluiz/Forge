import "./util/environment.js";
import { getSequelize } from "./util/sequelize.js";
import { setupControllers } from "./util/setup/controllers.js";
import { setupFrontend } from "./util/setup/frontend.js";
import { setupHandlers } from "./util/setup/handlers.js";
import { setupMiddleware } from "./util/setup/middleware.js";
import { setupSwagger } from "./util/setup/swagger.js";
import chalk from "chalk";
import express from "express";
import logging from "./util/logging.js";

const app = express();

setupMiddleware(app);

await setupControllers(app);
await setupHandlers();

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
