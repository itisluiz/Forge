import { getPlanningpokerData } from "../../util/requestmeta.js";
import { mapPlanningpokerResponse } from "../../mappers/response/planningpokerresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const pokerSession = getPlanningpokerData(req);

	const response = mapPlanningpokerResponse(pokerSession);
	res.status(200).send(response);
}
