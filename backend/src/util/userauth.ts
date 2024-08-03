import { AuthToken } from "forge-shared/dto/authtoken.dto.js";
import { encryptPK } from "./encryption.js";
import jsonwebtoken from "jsonwebtoken";

const jwtSigningKey = Buffer.from(process.env["JWT_SIGNING_KEY"] as string, "base64");
const jwtIssuer = (process.env["NODE_ENV"] as string) === "production" ? "forge" : "forge-dev";

function makeJWTKey(password: string) {
	return Buffer.concat([Buffer.from(password), jwtSigningKey]);
}

export function issueUserJWT(id: number, password: string): string {
	return jsonwebtoken.sign({}, makeJWTKey(password), {
		subject: encryptPK("user", id),
		issuer: jwtIssuer,
		expiresIn: 43200,
	});
}

export function validateUserJWT(jwt: string, password: string): AuthToken {
	return jsonwebtoken.verify(jwt, makeJWTKey(password), { issuer: jwtIssuer }) as AuthToken;
}

export function decodeUserJWT(jwt: string): AuthToken | null {
	return jsonwebtoken.decode(jwt) as AuthToken;
}
