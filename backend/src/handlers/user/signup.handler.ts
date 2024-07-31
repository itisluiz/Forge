import { Request, Response } from "express";
import { UserSignupRequest } from "forge-shared/dto/request/usersignuprequest.dto";

export default async function (req: Request, res: Response) {
	const userSignupRequest = req.body as UserSignupRequest;
	throw Error("Not implemented");
}
