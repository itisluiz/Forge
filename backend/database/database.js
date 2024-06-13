import fs from "fs";
import { parse } from "dotenv";

const productionEnv = fs.existsSync(".secrets.env") ? parse(fs.readFileSync(".secrets.env")) : {};
const developmentEnv = fs.existsSync(".secrets.development.env") ? parse(fs.readFileSync(".secrets.development.env")) : {};

export default {
	production: {
		username: productionEnv.DB_USER,
		password: productionEnv.DB_PASS,
		database: productionEnv.DB_NAME,
		host: productionEnv.DB_HOST,
		port: productionEnv.DB_PORT,
		dialect: "mariadb",
	},
	development: {
		username: developmentEnv.DB_USER,
		password: developmentEnv.DB_PASS,
		database: developmentEnv.DB_NAME,
		host: developmentEnv.DB_HOST,
		port: developmentEnv.DB_PORT,
		dialect: "mariadb",
	},
};
