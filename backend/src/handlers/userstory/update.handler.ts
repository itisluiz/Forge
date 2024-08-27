import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { ForeignKeyConstraintError } from "sequelize";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapUserstoryResponse } from "../../mappers/response/userstoryresponse.mapper.js";
import { Request, Response } from "express";
import { UserstoryUpdateRequest } from "forge-shared/dto/request/userstoryupdaterequest.dto";

export default async function (req: Request, res: Response) {
	const userstoryUpdateRequest = req.body as UserstoryUpdateRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const userstoryId = decryptPK("userstory", req.params["userstoryEid"]);

	let userstory: any;

	try {
		let sprintId: number | null = null;
		if (userstoryUpdateRequest.sprintEid) {
			sprintId = decryptPK("sprint", userstoryUpdateRequest.sprintEid);
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
			include: [
				{
					model: sequelize.models["epic"],
					where: {
						projectId: authProject.projectId,
					},
					attributes: ["projectId"],
				},
				sequelize.models["task"],
			],
			transaction,
		});

		if (!userstory) {
			throw new BadRequestError("User story not found in the project");
		}

		userstory.set(
			{
				...(userstoryUpdateRequest.sprintEid !== undefined && { sprintId: sprintId }),
				...(userstoryUpdateRequest.title && { title: userstoryUpdateRequest.title }),
				...(userstoryUpdateRequest.description && { description: userstoryUpdateRequest.description }),
				...(userstoryUpdateRequest.narrative && { narrative: userstoryUpdateRequest.narrative }),
				...(userstoryUpdateRequest.premisse && { premisse: userstoryUpdateRequest.premisse }),
				...(userstoryUpdateRequest.storyActor && { storyActor: userstoryUpdateRequest.storyActor }),
				...(userstoryUpdateRequest.storyObjective && { storyObjective: userstoryUpdateRequest.storyObjective }),
				...(userstoryUpdateRequest.storyJustification && { storyJustification: userstoryUpdateRequest.storyJustification }),
				...(userstoryUpdateRequest.description && { description: userstoryUpdateRequest.description }),
				...(userstoryUpdateRequest.priority && { epriorityId: userstoryUpdateRequest.priority }),
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
