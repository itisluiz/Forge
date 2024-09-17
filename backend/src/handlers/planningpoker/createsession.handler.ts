import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { Op } from "sequelize";
import { planningpoker, PlanningpokerSession } from "../../session/planningpoker.session.js";
import { PlanningpokerCreatesessionRequest } from "forge-shared/dto/request/planningpokercreatesessionrequest.dto";
import { PlanningpokerCreatesessionResponse } from "forge-shared/dto/response/planningpokercreatesessionresponse.dto";
import { randomBytes } from "crypto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const planningpokerCreatesessionRequest = req.body as PlanningpokerCreatesessionRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let userstoryIds = planningpokerCreatesessionRequest.userstoryEids.map((userstoryEid) =>
		decryptPK("userstory", userstoryEid),
	);
	userstoryIds = Array.from(new Set(userstoryIds));

	let planningpokerCreatesessionCode;

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

		planningpokerCreatesessionCode = randomBytes(12).toString("hex");
		const planningpokerCreatesession: PlanningpokerSession = {
			agenda: planningpokerCreatesessionRequest.agenda,
			projectId: authProject.project.dataValues.id,
			userstoryIds: userstoryIds,
			startedAt: new Date(),
		};

		planningpoker.create(planningpokerCreatesessionCode, planningpokerCreatesession);
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response: PlanningpokerCreatesessionResponse = {
		sessionCode: planningpokerCreatesessionCode,
	};
	res.status(200).send(response);
}
