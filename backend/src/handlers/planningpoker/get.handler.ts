import { getSequelize } from "../../util/sequelize.js";
import { getUserData } from "../../util/requestmeta.js";
import { PlanningpokerResponse } from "forge-shared/dto/response/planningpokerresponse.dto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authUser = getUserData(req);

	try {
		// TODO: Planning Poker
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response: PlanningpokerResponse = {} as any;
	res.status(200).send(response);
}
