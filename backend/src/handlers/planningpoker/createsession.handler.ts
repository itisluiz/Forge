import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { Op } from "sequelize";
import { planningpoker } from "../../session/planningpoker.session.js";
import { PlanningpokerCreatesessionRequest } from "forge-shared/dto/request/planningpokercreatesessionrequest.dto";
import { PlanningpokerCreatesessionResponse } from "forge-shared/dto/response/planningpokercreatesessionresponse.dto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const planningpokerCreatesessionRequest = req.body as PlanningpokerCreatesessionRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let userstoryIds = new Set(
		planningpokerCreatesessionRequest.userstoryEids.map((userstoryEid) => decryptPK("userstory", userstoryEid)),
	);

	let sessionCode: any;

	try {
		const userstories = await sequelize.models["userstory"].findAll({
			where: {
				id: {
					[Op.in]: [...userstoryIds],
				},
			},
			include: [
				{
					model: sequelize.models["epic"],
					where: {
						projectId: authProject.project.dataValues.id,
					},
					attributes: ["projectId"],
				},
				{
					model: sequelize.models["task"],
				},
			],
			transaction,
		});

		if (userstories.length !== userstoryIds.size) {
			throw new BadRequestError("One or more user stories were not found in the project");
		}

		if (userstories.every((userstory) => userstory.dataValues.tasks.length === 0)) {
			throw new BadRequestError("None of the user stories provided have tasks");
		}

		sessionCode = planningpoker.create(
			planningpokerCreatesessionRequest.agenda,
			authProject.project.dataValues.id,
			userstories,
		);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response: PlanningpokerCreatesessionResponse = {
		sessionCode: sessionCode,
	};
	res.status(200).send(response);
}
