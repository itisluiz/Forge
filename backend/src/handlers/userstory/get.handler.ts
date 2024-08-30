import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapUserstoryResponse } from "../../mappers/response/userstoryresponse.mapper.js";
import { Request, Response } from "express";
import { BadRequestError } from "../../error/externalhandling.error.js";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const userstoryId = decryptPK("userstory", req.params["userstoryEid"]);

	let userstory: any;

	try {
		userstory = await sequelize.models["userstory"].findOne({
			where: {
				id: userstoryId,
			},
			include: [
				{
					model: sequelize.models["epic"],
					where: {
						projectId: authProject.project.dataValues.id,
					},
					attributes: ["projectId"],
				},
				sequelize.models["task"],
			],
			transaction,
		});

		if (!userstory) {
			throw new BadRequestError("User story not found in epic");
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapUserstoryResponse(userstory);
	res.status(200).send(response);
}
