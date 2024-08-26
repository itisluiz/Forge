import { BadRequestError } from "../../error/externalhandling.error.js";
import { getSequelize } from "../../util/sequelize.js";
import { issueUserJWT } from "../../util/userauth.js";
import { Request, Response } from "express";
import { UserSigninRequest } from "forge-shared/dto/request/usersigninrequest.dto";
import { UserSigninResponse } from "forge-shared/dto/response/usersigninresponse.dto";
import { validatePassword } from "../../util/encryption.js";

export default async function (req: Request, res: Response) {
	const userSigninRequest = req.body as UserSigninRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();

	let token: string;

	try {
		const user = await sequelize.models["user"].findOne({
			where: { email: userSigninRequest.email.toLowerCase() },
			transaction,
		});
		if (!user || !validatePassword(userSigninRequest.password, user.dataValues.password)) {
			throw new BadRequestError("Invalid email or password");
		}

		token = issueUserJWT(user.dataValues.id, user.dataValues.password);
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response: UserSigninResponse = { token };
	res.status(200).send(response);
}
