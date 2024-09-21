import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { planningpoker } from "../../session/planningpoker.session.js";
import { PlanningpokerCreatesessionRequest } from "forge-shared/dto/request/planningpokercreatesessionrequest.dto";
import { PlanningpokerCreatesessionResponse } from "forge-shared/dto/response/planningpokercreatesessionresponse.dto";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const planningpokerCreatesessionRequest = req.body as PlanningpokerCreatesessionRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const sprintId = decryptPK("sprint", planningpokerCreatesessionRequest.sprintEid);

	let sessionCode: any;

	try {
		const sprint = await sequelize.models["sprint"].findOne({
			where: {
				id: sprintId,
				projectId: authProject.project.dataValues.id,
			},
			include: sequelize.models["userstory"],
			transaction,
		});

		if (!sprint) {
			throw new BadRequestError("The sprint provided does not exist or does not belong to the project");
		}

		if (sprint.dataValues.userstories.length === 0) {
			throw new BadRequestError("The provided sprint does not have any userstories");
		}

		sessionCode = planningpoker.create(planningpokerCreatesessionRequest.agenda, authProject.project, sprint);

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
