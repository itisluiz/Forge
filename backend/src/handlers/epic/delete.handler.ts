import { Request, Response } from "express";
import { getSequelize } from "../../util/sequelize.js";
import { decryptPK } from "../../util/encryption.js";
import { EpicResponse } from "forge-shared/dto/response/epicresponse.dto";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();

	const projectId = decryptPK("project", req.params["projectEid"]);
	const epicId = req.params["epicId"];

	let epic: any;

	try {
		const epicToDelete = await sequelize.models["epic"].findOne({
			where: {
				id: epicId,
				projectId: projectId,
			},
			transaction,
		});

		if (!epicToDelete) {
			throw new Error("Epic not found");
		}

		await sequelize.models["userstory"].destroy({
			where: {
				epicId: epicId,
			},
			transaction,
		});

		await sequelize.models["epic"].destroy({
			where: {
				id: epicId,
				projectId: projectId,
			},
			transaction,
		});
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response: EpicResponse = {
		id: epic.id,
		title: epic.title,
		description: epic.description,
		projectId: epic.projectId,
	};

	res.status(200).send(response);
}
