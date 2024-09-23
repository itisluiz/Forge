import { BadRequestError } from "../../error/externalhandling.error.js";
import { BurndownResponse } from "forge-shared/dto/response/burndownresponse.dto";
import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { Request, Response } from "express";
import { BurndownEntryComposite } from "forge-shared/dto/composite/burndownentrycomposite.dto.js";

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

	const now = new Date();
	const burndownEntries: BurndownEntryComposite[] = [];
	for (
		let date = new Date(sprint.dataValues.startsAt);
		date <= sprint.dataValues.endsAt && date <= now;
		date.setDate(date.getDate() + 1)
	) {
		const entry: BurndownEntryComposite = {
			date: date.toISOString(),
			effort: sprint.calculateBurndownForDate(date),
		};

		burndownEntries.push(entry);
	}

	const response: BurndownResponse = {
		startsAt: sprint.dataValues.startsAt,
		endsAt: sprint.dataValues.endsAt,
		maxEffort: burndownEntries.length > 0 ? Math.max(...burndownEntries.map((entry) => entry.effort)) : 0,
		remaningEffort: burndownEntries.length > 0 ? burndownEntries[burndownEntries.length - 1].effort : 0,
		days: burndownEntries,
	};

	res.status(200).send(response);
}
