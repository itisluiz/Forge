import { decodeUserJWT, validateUserJWT } from "../util/userauth.js";
import { decryptPK } from "../util/encryption.js";
import { getSequelize } from "../util/sequelize.js";
import { NextFunction, Request, Response } from "express";
import { setUserData } from "../util/requestmeta.js";
import { UnauthorizedError } from "../error/externalhandling.error.js";
import jsonwebtoken from "jsonwebtoken";

export function authorize() {
	return async (req: Request, res: Response, next: NextFunction) => {
		const authorization = req.headers.authorization;
		if (!authorization) {
			throw new UnauthorizedError("Missing authorization token");
		}

		const [type, token] = authorization.split(" ");
		if (type.toLowerCase() !== "bearer" || !token) {
			throw new UnauthorizedError("Invalid authorization token");
		}

		const authToken = decodeUserJWT(token);
		if (!authToken) {
			throw new UnauthorizedError("Malformed authorization token");
		}

		const sequelize = await getSequelize();
		const user = await sequelize.models["user"].findByPk(decryptPK("user", authToken.sub));

		if (!user) {
			throw new UnauthorizedError("Invalid user provided in authorization token");
		}

		try {
			validateUserJWT(token, user.dataValues.password);
		} catch (error) {
			if (error instanceof jsonwebtoken.JsonWebTokenError) {
				throw new UnauthorizedError(`Bad authorization token: ${error.message}`);
			}

			throw new UnauthorizedError(`Bad authorization token`);
		}

		setUserData(req, user, authToken);
		next();
	};
}
