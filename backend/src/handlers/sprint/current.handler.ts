import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapSprintResponse } from "../../mappers/response/sprintresponse.mapper.js";
import { Op } from "sequelize";
import { Request, Response } from "express";
import { SprintMonadResponse } from "forge-shared/dto/response/sprintmonadresponse.dto";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let sprint: any;

	try {
		const now = new Date();
		sprint = await sequelize.models["sprint"].findOne({
			where: {
				startsAt: { [Op.lte]: now },
				endsAt: { [Op.gte]: now },
				projectId: authProject.project.dataValues.id,
			},
			include: { model: sequelize.models["userstory"], attributes: ["id"], include: [sequelize.models["task"]] },
			transaction,
		});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response: SprintMonadResponse = {
		sprint: sprint ? mapSprintResponse(sprint, authProject.project.dataValues.code) : null,
	};
	res.status(200).send(response);
}
