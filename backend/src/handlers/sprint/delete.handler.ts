import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const sprintId = decryptPK("sprint", req.params["sprintEid"]);

	try {
		const destroyedCount = await sequelize.models["sprint"].destroy({
			where: {
				id: sprintId,
				projectId: authProject.project.dataValues.id,
			},
			transaction,
		});

		if (!destroyedCount) {
			throw new BadRequestError("Sprint not found in the project");
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	res.status(200).send();
}
