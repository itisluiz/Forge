import express, { Express } from "express";

export function setupFrontend(app: Express) {
	app.use(express.static(process.env["FRONTEND_DIR"] as string));
	app.use("*", (req, res) => {
		res.sendFile("/index.html", { root: process.env["FRONTEND_DIR"] as string });
	});
}
