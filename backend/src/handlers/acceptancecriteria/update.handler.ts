import { AcceptanceCriteriaUpdateRequest } from "forge-shared/dto/request/acceptancecriteriaupdaterequest.dto";
import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapAcceptanceCriteriaResponse } from "../../mappers/response/acceptancecriteriaresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const taskUpdateRequest = req.body as AcceptanceCriteriaUpdateRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const acceptancecriteriaId = decryptPK("acceptancecriteria", req.params["acceptancecriteriaEid"]);

	let acceptancecriteria: any;

	try {
		acceptancecriteria = await sequelize.models["acceptancecriteria"].findOne({
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

		acceptancecriteria.set(
			{
				...(taskUpdateRequest.given && { criteriaGiven: taskUpdateRequest.given }),
				...(taskUpdateRequest.when && { criteriaWhen: taskUpdateRequest.when }),
				...(taskUpdateRequest.then && { criteriaThen: taskUpdateRequest.then }),
			},
			{ transaction },
		);

		await acceptancecriteria.save({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapAcceptanceCriteriaResponse(acceptancecriteria);
	res.status(200).send(response);
}
