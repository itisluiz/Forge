import { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions: swaggerJSDoc.Options = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Forge API",
			version: "0.0.0",
			description: "API documentation for the Forge endpoints",
		},
		servers: [
			{
				url: "http://localhost:5201",
				description: "Local API",
			},
			{
				url: "https://forgedev.itisluiz.com",
				description: "Remote API",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	apis: ["./node_modules/forge-shared/**/*.*.ts", "./src/controllers/**/*.controller.ts"],
};

export function setupSwagger(app: Express) {
	const swaggerSpec = swaggerJSDoc(swaggerOptions);
	app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
