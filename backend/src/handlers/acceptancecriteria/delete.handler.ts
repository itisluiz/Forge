import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const acceptancecriteriaId = decryptPK("acceptancecriteria", req.params["acceptancecriteriaEid"]);

	try {
		const acceptancecriteria = await sequelize.models["acceptancecriteria"].findOne({
			where: {
				id: acceptancecriteriaId,
			},
			include: [
				{
					model: sequelize.models["userstory"],
					include: [
						{
							model: sequelize.models["epic"],
							where: { projectId: authProject.project.dataValues.id },
							attributes: ["projectId"],
						},
					],
					attributes: ["epicId"],
				},
			],
			transaction,
		});

		if (!acceptancecriteria || !acceptancecriteria.dataValues.userstory) {
			throw new BadRequestError("Acceptance criteria not found in the project");
		}

		await acceptancecriteria.destroy({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	res.status(200).send();
}
