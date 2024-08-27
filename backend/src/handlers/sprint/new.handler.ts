import { BadRequestError } from "../../error/externalhandling.error.js";
import { ForeignKeyConstraintError } from "sequelize";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapSprintResponse } from "../../mappers/response/sprintresponse.mapper.js";
import { Request, Response } from "express";
import { SprintNewRequest } from "forge-shared/dto/request/sprintnewrequest.dto.js";

export default async function (req: Request, res: Response) {
	const sprintNewRequest = req.body as SprintNewRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let sprint: any;

	try {
		sprint = await sequelize.models["sprint"].create(
			{
				projectId: authProject.projectId,
				startsAt: sprintNewRequest.startsAt,
				endsAt: sprintNewRequest.endsAt,
				esprintstatusId: sprintNewRequest.status,
			},
			{ transaction },
		);

		if (!sprint.validInterval()) {
			throw new BadRequestError("The sprint interval is invalid");
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();

		if (error instanceof ForeignKeyConstraintError && error.table === "esprintstatuses") {
			throw new BadRequestError("The sprint status you specified does not exist");
		}

		throw error;
	}

	const response = mapSprintResponse(sprint);
	res.status(200).send(response);
}
