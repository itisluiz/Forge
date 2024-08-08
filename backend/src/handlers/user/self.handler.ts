import { getUserData } from "../../util/requestmeta.js";
import { Request, Response } from "express";
import { UserSelfResponse } from "forge-shared/dto/response/userselfresponse.dto";

export default async function (req: Request, res: Response) {
	const authUser = getUserData(req);

	const response: UserSelfResponse = {
		email: authUser.user.dataValues.email,
		name: authUser.user.dataValues.name,
		surname: authUser.user.dataValues.surname,
		createdAt: authUser.user.dataValues.createdAt,
	};
	res.status(200).send(response);
}
