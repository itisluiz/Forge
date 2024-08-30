import { AcceptanceCriteriaNewRequest } from "forge-shared/dto/request/acceptancecriterianewrequest.dto";
import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapAcceptanceCriteriaResponse } from "../../mappers/response/acceptancecriteriaresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const acceptancecriteriaNewRequest = req.body as AcceptanceCriteriaNewRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let acceptancecriteria: any;

	try {
		const userstoryId = decryptPK("userstory", acceptancecriteriaNewRequest.userstoryEid);
		const userstory = await sequelize.models["userstory"].findOne({
			where: { id: userstoryId },
			include: {
				model: sequelize.models["epic"],
				attributes: ["projectId"],
				where: { projectId: authProject.project.dataValues.id },
			},
			transaction,
		});
		if (!userstory) {
			throw new BadRequestError("The user story you specified does not exist in the project");
		}

		acceptancecriteria = await sequelize.models["acceptancecriteria"].create(
			{
				userstoryId: userstoryId,
				criteriaGiven: acceptancecriteriaNewRequest.given,
				criteriaWhen: acceptancecriteriaNewRequest.when,
				criteriaThen: acceptancecriteriaNewRequest.then,
			},
			{ transaction },
		);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapAcceptanceCriteriaResponse(acceptancecriteria);
	res.status(200).send(response);
}
