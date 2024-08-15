import { getUserData } from "../../util/requestmeta.js";
import { Request, Response } from "express";
import { mapUserSelf } from "../../mappers/userself.mapper.js";

export default async function (req: Request, res: Response) {
	const authUser = getUserData(req);

	const response = mapUserSelf(authUser.user);
	res.status(200).send(response);
}
