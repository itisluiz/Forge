import { AuthToken } from "forge-shared/dto/authtoken.dto";
import { Model } from "sequelize";
import { Request } from "express";

export function setUserData(req: Request, user: Model<any, any>, authToken: AuthToken) {
	(req as any).__reqinjection_user = user;
	(req as any).__reqinjection_authtoken = authToken;
}

export function getUserData(req: Request) {
	return {
		user: (req as any).__reqinjection_user as Model<any, any>,
		authToken: (req as any).__reqinjection_authtoken as AuthToken,
	};
}
