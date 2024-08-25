import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { ForeignKeyConstraintError } from "sequelize";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapUserstoryResponse } from "../../mappers/response/userstoryresponse.mapper.js";
import { Request, Response } from "express";
import { UserstoryUpdateRequest } from "forge-shared/dto/request/userstoryupdaterequest.dto";

export default async function (req: Request, res: Response) {
	const userstoryNewRequest = req.body as UserstoryUpdateRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const userstoryId = decryptPK("userstory", req.params["userstoryEid"]);

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

		userstory = await sequelize.models["userstory"].findOne({
			where: {
				id: userstoryId,
			},
			include: {
				model: sequelize.models["epic"],
				where: {
					projectId: authProject.projectId,
				},
				attributes: ["projectId"],
			},
			transaction,
		});

		if (!userstory) {
			throw new BadRequestError("User story not found in the project");
		}

		userstory.set(
			{
				...(userstoryNewRequest.sprintEid !== undefined && { sprintId: sprintId }),
				...(userstoryNewRequest.title && { title: userstoryNewRequest.title }),
				...(userstoryNewRequest.description && { description: userstoryNewRequest.description }),
				...(userstoryNewRequest.storyActor && { storyActor: userstoryNewRequest.storyActor }),
				...(userstoryNewRequest.storyObjective && { storyObjective: userstoryNewRequest.storyObjective }),
				...(userstoryNewRequest.storyJustification && { storyJustification: userstoryNewRequest.storyJustification }),
				...(userstoryNewRequest.description && { description: userstoryNewRequest.description }),
				...(userstoryNewRequest.priority && { epriorityId: userstoryNewRequest.priority }),
			},
			{ transaction },
		);

		await userstory.save({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();

		if (error instanceof ForeignKeyConstraintError && error.table === "epriorities") {
			throw new BadRequestError("The priority you specified does not exist");
		}

		throw error;
	}

	const response = mapUserstoryResponse(userstory);
	res.status(200).send(response);
}
