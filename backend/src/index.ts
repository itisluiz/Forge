import "./util/environment.js";
import { getSequelize } from "./util/sequelize.js";
import { setupControllers } from "./setup/controllers.js";
import { setupEarlyMiddleware, setupLateMiddleware } from "./setup/middleware.js";
import { setupErrorTransformers } from "./setup/errortransformers.js";
import { setupFrontend } from "./setup/frontend.js";
import { setupHandlers } from "./setup/handlers.js";
import { setupSwagger } from "./setup/swagger.js";
import chalk from "chalk";
import express from "express";
import logging from "./util/logging.js";

const app = express();

setupErrorTransformers();
setupEarlyMiddleware(app);

await setupHandlers();
await setupControllers(app);

setupLateMiddleware(app);

if (process.env["NODE_ENV"] === "production") {
	logging.logInfo("startup", "Server is running on the", chalk.red("production"), "environment");
	setupFrontend(app);
} else {
	logging.logInfo("startup", "Server is running on the", chalk.cyanBright("development"), "environment");
	setupSwagger(app);
	setupFrontend(app);
}

// Pre-cache the database connection
await getSequelize();

app.listen(process.env["PORT"], () => {
	logging.logSuccess("startup", `Server started on http://localhost:${process.env["PORT"]}`);
});
