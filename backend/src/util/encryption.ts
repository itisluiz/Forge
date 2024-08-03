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
