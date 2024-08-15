import { getSequelize } from "../../util/sequelize.js";
import { handle } from "../../util/handle.js";
import { hashPassword } from "../../util/encryption.js";
import { Request, Response } from "express";
import { UserSignupRequest } from "forge-shared/dto/request/usersignuprequest.dto";

export default async function (req: Request, res: Response) {
	const userSignupRequest = req.body as UserSignupRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();

	try {
		await sequelize.models["user"].create(
			{
				email: userSignupRequest.email,
				password: hashPassword(userSignupRequest.password),
				name: userSignupRequest.name,
				surname: userSignupRequest.surname,
			},
			{ transaction },
		);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	await handle("user", "signin", req, res);
}
