import { BadRequestError } from "../../error/externalhandling.error.js";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapGanttResponse } from "../../mappers/response/ganttresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
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

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapGanttResponse(sprint, authProject.project.dataValues.code);
	res.status(200).send(response);
}
