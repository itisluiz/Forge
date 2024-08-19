import { getSequelize } from "../../util/sequelize.js";
import { Request, Response } from "express";
import { decryptPK } from "../../util/encryption.js";
import { mapEpicSelfResponse } from "../../mappers/response/epicselfresponse.mapper.js";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();

	let epics: any;

	const projectId = decryptPK("project", req.params["projectEid"]);
	try {
		epics = await sequelize.models["epic"].findAll({
			where: {
				projectId: projectId,
			},
		});
	} catch (error) {
		throw error;
	}

	const response = mapEpicSelfResponse(epics);
	res.status(200).send(response);
}
