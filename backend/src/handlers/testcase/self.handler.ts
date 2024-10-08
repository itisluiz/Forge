import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapTestcaseSelfResponse } from "../../mappers/response/testcaseselfresponse.mapper.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const acceptancecriteriaId = decryptPK("acceptancecriteria", req.params["acceptancecriteriaEid"]);

	let testcases: any;

	try {
		testcases = await sequelize.models["testcase"].findAll({
			where: {
				acceptancecriteriumId: acceptancecriteriaId,
			},
			include: [
				{
					model: sequelize.models["acceptancecriteria"],
					include: [
						{
							model: sequelize.models["userstory"],
							include: [
								{
									model: sequelize.models["epic"],
									where: { projectId: authProject.project.dataValues.id },
									attributes: ["projectId"],
								},
							],
							attributes: ["epicId"],
						},
					],
					attributes: ["userstoryId"],
				},
				{
					model: sequelize.models["testcasestep"],
					attributes: ["id"],
				},
			],
			attributes: ["id", "description", "precondition"],
			transaction,
		});

		testcases = testcases.filter(
			(testcase: any) =>
				authProject.project.dataValues.id ==
				testcase?.dataValues.acceptancecriterium?.dataValues.userstory?.dataValues.epic?.dataValues.projectId,
		);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapTestcaseSelfResponse(testcases);
	res.status(200).send(response);
}
