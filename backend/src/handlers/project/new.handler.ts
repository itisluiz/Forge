import { getSequelize } from "../../util/sequelize.js";
import { Request, Response } from "express";
import { ProjectNewRequest } from "forge-shared/dto/request/projectnewrequest.dto";
import { ProjectRole } from "forge-shared/enum/projectrole.enum";
import { getUserData } from "../../util/requestmeta.js";
import { mapProjectResponse } from "../../mappers/response/projectresponse.mapper.js";

export default async function (req: Request, res: Response) {
	const projectNewRequest = req.body as ProjectNewRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authUser = getUserData(req);

	let project: any;

	try {
		project = await sequelize.models["project"].create(
			{
				code: projectNewRequest.code,
				title: projectNewRequest.title,
				description: projectNewRequest.description,
			},
			{ transaction, include: [sequelize.models["user"]] },
		);

		await project.addUser(authUser.user, {
			transaction,
			through: { eprojectroleId: ProjectRole.PRODUCT_OWNER, isAdmin: true },
		});

		await transaction.commit();
		await project.reload();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapProjectResponse(project);
	res.status(200).send(response);
}
