import { BadRequestError } from "../../error/externalhandling.error.js";
import { ForeignKeyConstraintError, Op } from "sequelize";
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
		const overlappingSprint = await sequelize.models["sprint"].findOne({
			where: {
				projectId: authProject.project.dataValues.id,
				[Op.and]: {
					startsAt: {
						[Op.lt]: sprintNewRequest.endsAt,
					},
					endsAt: {
						[Op.gt]: sprintNewRequest.startsAt,
					},
				},
			},
			transaction,
		});

		if (overlappingSprint) {
			throw new BadRequestError("The sprint interval overlaps with an existing sprint");
		}

		sprint = await sequelize.models["sprint"].create(
			{
				projectId: authProject.project.dataValues.id,
				startsAt: sprintNewRequest.startsAt,
				endsAt: sprintNewRequest.endsAt,
				esprintstatusId: sprintNewRequest.status,
				targetVelocity: sprintNewRequest.targetVelocity,
			},
			{
				transaction,
				include: { model: sequelize.models["userstory"], attributes: ["id"], include: [sequelize.models["task"]] },
			},
		);

		if (!sprint.validInterval()) {
			throw new BadRequestError("The sprint interval is invalid");
		}

		await sprint.reload({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();

		if (error instanceof ForeignKeyConstraintError && error.table === "esprintstatuses") {
			throw new BadRequestError("The sprint status you specified does not exist");
		}

		throw error;
	}

	const response = mapSprintResponse(sprint, authProject.project.dataValues.code);
	res.status(200).send(response);
}
