import "./util/environment.js";
import express from "express";
import { setupSwagger } from "./setup/swagger.js";
import { setupApis } from "./setup/apis.js";
import { setupFrontend } from "./setup/frontend.js";

const app = express();

await setupApis(app);

if (process.env["NODE_ENV"] === "production") {
	setupFrontend(app);
} else {
	setupSwagger(app);
}

app.listen(process.env["PORT"], () => {
	console.log(`http://localhost:${process.env["PORT"]}`);
});
