import { getUserData } from "../../util/requestmeta.js";
import { Request, Response } from "express";
import { mapUserSelfResponse } from "../../mappers/response/userselfresponse.mapper.js";

export default async function (req: Request, res: Response) {
	const authUser = getUserData(req);

	const response = mapUserSelfResponse(authUser.user);
	res.status(200).send(response);
}
