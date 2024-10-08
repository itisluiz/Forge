import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { NotFoundError } from "../../error/externalhandling.error.js";
import { Request, Response } from "express";
import { TestcaseSuggestionRequest } from "forge-shared/dto/request/testcasesuggestionrequest.dto";
import { promptAITestcase } from "../../ai/prompts/testcase.prompt.js";
import { ExternalServiceError } from "../../error/internalhandling.error.js";

export default async function (req: Request, res: Response) {
	const testcaseSuggestionRequest = req.body as TestcaseSuggestionRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const acceptancecriteriaId = decryptPK("acceptancecriteria", testcaseSuggestionRequest.acceptancecriteriaEid);

	let acceptancecriteria: any;

	try {
		acceptancecriteria = await sequelize.models["acceptancecriteria"].findByPk(acceptancecriteriaId, {
			attributes: ["criteriaGiven", "criteriaWhen", "criteriaThen"],
			include: [
				{
					model: sequelize.models["userstory"],
					attributes: ["title", "description", "narrative", "storyActor", "storyObjective", "storyJustification"],
					include: [
						{
							model: sequelize.models["epic"],
							attributes: ["title", "description"],
							include: [
								{
									model: sequelize.models["project"],
									attributes: ["id", "title", "description"],
								},
							],
						},
						{
							model: sequelize.models["task"],
							attributes: ["title"],
						},
					],
				},
				{
					model: sequelize.models["testcase"],
					attributes: ["description"],
				},
			],
		});

		if (
			acceptancecriteria?.dataValues.userstory.dataValues.epic.dataValues.project.dataValues.id !==
			authProject.project.dataValues.id
		) {
			throw new NotFoundError("Acceptance criteria not found or does not belong to the project");
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const result = await promptAITestcase(acceptancecriteria);
	if (!result) {
		throw new ExternalServiceError("Failed to get suggestion from AI service");
	}

	res.status(200).send(result);
}
