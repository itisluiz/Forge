import { BadRequestError, ForbiddenError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { ForeignKeyConstraintError, Op } from "sequelize";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapSprintResponse } from "../../mappers/response/sprintresponse.mapper.js";
import { Request, Response } from "express";
import { SprintUpdateRequest } from "forge-shared/dto/request/sprintupdaterequest.dto.js";

export default async function (req: Request, res: Response) {
	const sprintUpdateRequest = req.body as SprintUpdateRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const sprintId = decryptPK("sprint", req.params["sprintEid"]);

	let sprint: any;

	try {
		sprint = await sequelize.models["sprint"].findOne({
			where: {
				id: sprintId,
				projectId: authProject.project.dataValues.id,
			},
			include: { model: sequelize.models["userstory"], attributes: ["id"], include: [sequelize.models["task"]] },
			transaction,
		});

		if (!sprint) {
			throw new BadRequestError("Sprint not found in the project");
		}

		sprint.set(
			{
				...(sprintUpdateRequest.startsAt && { startsAt: sprintUpdateRequest.startsAt }),
				...(sprintUpdateRequest.endsAt && { endsAt: sprintUpdateRequest.endsAt }),
				...(sprintUpdateRequest.status && { esprintstatusId: sprintUpdateRequest.status }),
				...(sprintUpdateRequest.targetVelocity !== undefined && { targetVelocity: sprintUpdateRequest.targetVelocity }),
			},
			{ transaction },
		);

		if (!sprint.validInterval()) {
			throw new BadRequestError("The sprint interval is invalid");
		}

		const overlappingSprint = await sequelize.models["sprint"].findOne({
			where: {
				id: {
					[Op.ne]: sprint.dataValues.id,
				},
				projectId: authProject.project.dataValues.id,
				[Op.and]: {
					startsAt: {
						[Op.lt]: sprint.dataValues.endsAt,
					},
					endsAt: {
						[Op.gt]: sprint.dataValues.startsAt,
					},
				},
			},
			transaction,
		});

		if (overlappingSprint) {
			throw new ForbiddenError("The sprint interval overlaps with an existing sprint");
		}

		await sprint.save({ transaction });
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
