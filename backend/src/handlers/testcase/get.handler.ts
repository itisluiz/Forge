import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapTestcaseResponse } from "../../mappers/response/testcaseresponse.mapper.js";
import { NotFoundError } from "../../error/externalhandling.error.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);
	const testcaseId = decryptPK("testcase", req.params["testcaseEid"]);

	let testcase: any;

	try {
		testcase = await sequelize.models["testcase"].findByPk(testcaseId, {
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
					attributes: ["action", "expectedBehavior"],
				},
			],
			transaction,
		});

		const testcaseProjectId =
			testcase?.dataValues.acceptancecriterium?.dataValues.userstory?.dataValues.epic?.dataValues.projectId;
		if (testcaseProjectId !== authProject.project.dataValues.id) {
			throw new NotFoundError("Test case not exist or does not belong to the project");
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapTestcaseResponse(testcase);
	res.status(200).send(response);
}
