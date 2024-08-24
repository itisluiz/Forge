import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { ForeignKeyConstraintError } from "sequelize";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapUserstoryResponse } from "../../mappers/response/userstoryresponse.mapper.js";
import { Request, Response } from "express";
import { UserstoryNewRequest } from "forge-shared/dto/request/userstorynewrequest.dto.js";

export default async function (req: Request, res: Response) {
	const userstoryNewRequest = req.body as UserstoryNewRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let userstory: any;

	try {
		let sprintId: number | null = null;
		if (userstoryNewRequest.sprintEid) {
			sprintId = decryptPK("sprint", userstoryNewRequest.sprintEid);
			const sprint = await sequelize.models["sprint"].findOne({
				where: { id: sprintId, projectId: authProject.projectId },
				attributes: ["id"],
				transaction,
			});
			if (!sprint) {
				throw new BadRequestError("The specified sprint was not found in the project");
			}
		}

		userstory = await sequelize.models["userstory"].create(
			{
				title: userstoryNewRequest.title,
				description: userstoryNewRequest.description,
				storyActor: userstoryNewRequest.storyActor,
				storyObjective: userstoryNewRequest.storyObjective,
				storyJustification: userstoryNewRequest.storyJustification,
				epicId: decryptPK("epic", userstoryNewRequest.epicEid),
				epriorityId: userstoryNewRequest.priority,
				sprintId,
			},
			{ transaction },
		);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();

		if (error instanceof ForeignKeyConstraintError && error.table === "epics") {
			throw new BadRequestError("The epic you specified does not exist in the project");
		}

		throw error;
	}

	const response = mapUserstoryResponse(userstory);
	res.status(200).send(response);
}
