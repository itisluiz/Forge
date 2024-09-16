import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { Op } from "sequelize";
import { planningpoker, PlanningpokerSession } from "../../session/planningpoker.session.js";
import { PlanningpokerSessionRequest } from "forge-shared/dto/request/planningpokersessionrequest.dto";
import { PlanningpokerSessionResponse } from "forge-shared/dto/response/planningpokersessionresponse.dto";
import { randomBytes } from "crypto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const planningpokerSessionRequest = req.body as PlanningpokerSessionRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let userstoryIds = planningpokerSessionRequest.userstoryEids.map((userstoryEid) => decryptPK("userstory", userstoryEid));
	userstoryIds = Array.from(new Set(userstoryIds));

	let planningpokerSessionCode;

	try {
		const userstories = await sequelize.models["userstory"].findAll({
			where: {
				id: {
					[Op.in]: userstoryIds,
				},
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

		if (userstories.length !== userstoryIds.length) {
			throw new BadRequestError("One or more user stories were not found in the project");
		}

		planningpokerSessionCode = randomBytes(12).toString("hex");
		const planningpokerSession: PlanningpokerSession = {
			agenda: planningpokerSessionRequest.agenda,
			projectId: authProject.project.dataValues.id,
			userstoryIds: userstoryIds,
			startedAt: new Date(),
		};

		planningpoker.create(planningpokerSessionCode, planningpokerSession);
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response: PlanningpokerSessionResponse = {
		sessionCode: planningpokerSessionCode,
	};
	res.status(200).send(response);
}
