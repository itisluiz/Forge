import { decryptPK } from "../../util/encryption.js";
import { ExternalServiceError } from "../../error/internalhandling.error.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { NotFoundError } from "../../error/externalhandling.error.js";
import { promptAISprintoverview } from "../../ai/prompts/sprintoverview.prompt.js";
import { Request, Response } from "express";
import { SprintOverviewRequest } from "forge-shared/dto/request/sprintoverviewrequest.dto";
import { SprintOverviewResponse } from "forge-shared/dto/response/sprintoverviewresponse.dto";
import NodeCache from "node-cache";

const sprintOverviewCache = new NodeCache({ stdTTL: 21600, checkperiod: 3600, deleteOnExpire: true });

export default async function (req: Request, res: Response) {
	const sprintOverviewRequest = req.body as SprintOverviewRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const sprintId = decryptPK("sprint", req.params["sprintEid"]);

	let sprint: any;

	try {
		sprint = await sequelize.models["sprint"].findByPk(sprintId, {
			attributes: ["startsAt", "endsAt", "esprintstatusId"],
			include: [
				{
					model: sequelize.models["userstory"],
					attributes: ["title", "description", "effortScore"],
					include: [
						{
							model: sequelize.models["task"],
							attributes: [
								"title",
								"description",
								"epriorityId",
								"etasktypeId",
								"etaskstatusId",
								"complexity",
								"createdAt",
								"startedAt",
								"completedAt",
							],
							include: [
								{
									model: sequelize.models["user"],
									attributes: ["name"],
								},
							],
						},
					],
				},
				{
					model: sequelize.models["project"],
					attributes: ["id", "title", "description"],
				},
			],
		});

		if (sprint?.dataValues.project.dataValues.id !== authProject.project.dataValues.id) {
			throw new NotFoundError("Sprint not found or does not belong to the project");
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	if (!sprintOverviewCache.has(sprintId) || sprintOverviewRequest.forceRegenerate) {
		const textResult = await promptAISprintoverview(sprint);
		if (!textResult) {
			throw new ExternalServiceError("Failed to get overview from AI service");
		}

		const result: SprintOverviewResponse = { sprintOverview: textResult, generatedAt: new Date().toISOString() };
		sprintOverviewCache.set(sprintId, result);
	}

	const result = sprintOverviewCache.get(sprintId) as SprintOverviewResponse;
	res.status(200).send(result);
}
