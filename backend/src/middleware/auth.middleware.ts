import { getAuthTokenFromRequest, userFromAuthToken } from "../util/userauth.js";
import { NextFunction, Request, Response } from "express";
import { setUserData } from "../util/requestmeta.js";

export function authorize() {
	return async (req: Request, res: Response, next: NextFunction) => {
		const authToken = getAuthTokenFromRequest(req);
		const user = await userFromAuthToken(authToken);
		setUserData(req, user, authToken);
		next();
	};
}
