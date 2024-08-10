import { skip32 } from "../lib/skip32.js";
import crypto from "crypto";

const encryptionKey = Buffer.from(process.env["ENCRYPTION_KEY"] as string, "base64");
const tableEncryptionKeys: { [table: string]: Buffer } = {};

function getOrCreateTableKey(table: string): Buffer {
	table = table.toLowerCase();

	if (!tableEncryptionKeys[table]) {
		const combinedValues = Buffer.concat([Buffer.from(table), encryptionKey]);
		const md5Hash = crypto.createHash("md5").update(combinedValues);
		tableEncryptionKeys[table] = md5Hash.digest();
	}

	return tableEncryptionKeys[table];
}

export function encryptPK(table: string, value: number): string {
	const result = skip32.encrypt(value, getOrCreateTableKey(table));
	return result.toString(16).padStart(8, "0");
}

export function decryptPK(table: string, value: string): number {
	const result = parseInt(value, 16);
	return skip32.decrypt(result, getOrCreateTableKey(table));
}

export function hashPassword(password: string): string {
	const hash = crypto.pbkdf2Sync(password, encryptionKey, 4096, 48, "sha256");
	return hash.toString("base64");
}

export function validatePassword(password: string, hash: string): boolean {
	const passwordBuffer = Buffer.from(hashPassword(password));
	const hashBuffer = Buffer.from(hash);

	if (passwordBuffer.length !== hashBuffer.length) {
		return false;
	}

	return crypto.timingSafeEqual(Buffer.from(hashPassword(password)), Buffer.from(hash));
}
