import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const userstoryId = decryptPK("userstory", req.params["userstoryEid"]);

	try {
		const userstory = await sequelize.models["userstory"].findOne({
			where: {
				id: userstoryId,
			},
			include: {
				model: sequelize.models["epic"],
				where: {
					projectId: authProject.project.dataValues.id,
				},
				attributes: ["projectId"],
			},
			transaction,
		});

		if (!userstory) {
			throw new BadRequestError("User story not found in epic");
		}

		await userstory.destroy({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	res.status(200).send();
}
