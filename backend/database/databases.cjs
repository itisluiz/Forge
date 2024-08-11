const dotenv = require("dotenv");

const development_env = dotenv.config({ path: ".secrets.development.env" }).parsed;
const production_env = dotenv.config({ path: ".secrets.env" }).parsed;

module.exports = {
	development: {
		username: development_env.DB_USER,
		password: development_env.DB_PASS,
		database: development_env.DB_NAME,
		host: development_env.DB_HOST,
		port: development_env.DB_PORT,
		dialect: "mariadb",
	},
	production: {
		username: production_env.DB_USER,
		password: production_env.DB_PASS,
		database: production_env.DB_NAME,
		host: production_env.DB_HOST,
		port: production_env.DB_PORT,
		dialect: "mariadb",
	},
};
