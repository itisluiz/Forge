import { getSequelize } from "../../util/sequelize.js";
import { getUserData } from "../../util/requestmeta.js";
import { mapProjectResponse } from "../../mappers/response/projectresponse.mapper.js";
import { ProjectNewRequest } from "forge-shared/dto/request/projectnewrequest.dto";
import { ProjectRole } from "forge-shared/enum/projectrole.enum";
import { Request, Response } from "express";

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
			{ transaction, include: [sequelize.models["user"], sequelize.models["epic"]] },
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

	const self = project.dataValues.users.find((user: any) => user.dataValues.id === authUser.user.dataValues.id);
	const response = mapProjectResponse(project, self);
	res.status(200).send(response);
}
