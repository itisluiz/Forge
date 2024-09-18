import { AuthToken } from "forge-shared/dto/authtoken.dto.js";
import { decryptPK, encryptPK } from "./encryption.js";
import { getSequelize } from "./sequelize.js";
import { NotAuthenticatedError } from "../error/externalhandling.error.js";
import { Request } from "express";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import NodeCache from "node-cache";
import { Model } from "sequelize";

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
	const decoded = jsonwebtoken.verify(jwt, makeJWTKey(password), { issuer: jwtIssuer }) as JwtPayload;
	return { token: jwt, ...(decoded as JwtPayload) } as AuthToken;
}

export function decodeUserJWT(jwt: string): AuthToken | null {
	const decoded = jsonwebtoken.decode(jwt);
	return decoded ? ({ token: jwt, ...(decoded as JwtPayload) } as AuthToken) : null;
}

// Methods below may throw and are less generic
// User cache, mainly created for the planning poker polling
const userCache = new NodeCache({ stdTTL: 43200, checkperiod: 600 });

export function getAuthTokenFromRequest(req: Request) {
	const authorization = req.headers.authorization;
	if (!authorization) {
		throw new NotAuthenticatedError("Missing authorization token");
	}

	const [type, token] = authorization.split(" ");
	if (type.toLowerCase() !== "bearer" || !token) {
		throw new NotAuthenticatedError("Invalid authorization token");
	}

	const authToken = decodeUserJWT(token);
	if (!authToken) {
		throw new NotAuthenticatedError("Malformed authorization token");
	}

	return authToken;
}

export async function userFromAuthToken(authToken: AuthToken, allowCached = true): Promise<Model<any, any>> {
	if (allowCached && userCache.has(authToken.token)) {
		return userCache.get(authToken.token)!;
	}

	const sequelize = await getSequelize();
	const user = await sequelize.models["user"].findByPk(decryptPK("user", authToken.sub));

	if (!user) {
		throw new NotAuthenticatedError("Invalid user provided in authorization token");
	}

	try {
		validateUserJWT(authToken.token, user.dataValues.password);
	} catch (error) {
		if (error instanceof jsonwebtoken.JsonWebTokenError) {
			throw new NotAuthenticatedError(`Bad authorization token: ${error.message}`);
		}

		throw new NotAuthenticatedError(`Bad authorization token`);
	}

	userCache.set(authToken.token, user);
	return user;
}
