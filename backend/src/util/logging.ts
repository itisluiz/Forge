import chalk, { ChalkInstance } from "chalk";
import crypto from "crypto";

const logLevel = parseInt(process.env["LOG_LEVEL"] ?? "0");
const chalkColors = [
	chalk.red,
	chalk.green,
	chalk.yellow,
	chalk.blue,
	chalk.magenta,
	chalk.cyan,
	chalk.redBright,
	chalk.greenBright,
	chalk.yellowBright,
	chalk.blueBright,
	chalk.magentaBright,
	chalk.cyanBright,
];

function originColor(origin: string) {
	const md5Hash = crypto.createHash("md5").update(origin.toString()).digest("hex");
	const parsedHash = parseInt(md5Hash.slice(-2), 16);
	return chalkColors[parsedHash % chalkColors.length];
}

function formattedTime() {
	const now = new Date();
	return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

function logInternal(origin: string, color: ChalkInstance, ...what: any[]) {
	const orColor = originColor(origin);
	console.log(`${color(`[${formattedTime()}][`)}${orColor(origin)}${color("]:")}`, color(...what));
}

function logSuccess(origin: string, ...what: any[]) {
	logInternal(origin, chalk.greenBright, ...what);
}

function logError(origin: string, ...what: any[]) {
	logInternal(origin, chalk.red, ...what);
}

function logInfo(origin: string, ...what: any[]) {
	if (logLevel >= 1) logInternal(origin, chalk.white, ...what);
}

function logWarn(origin: string, ...what: any[]) {
	if (logLevel >= 2) logInternal(origin, chalk.yellow, ...what);
}

function logDebug(origin: string, ...what: any[]) {
	if (logLevel >= 3) logInternal(origin, chalk.dim, ...what);
}

export default { logSuccess, logInfo, logError, logWarn, logDebug };
