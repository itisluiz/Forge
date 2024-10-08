import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapTestcaseResponse } from "../../mappers/response/testcaseresponse.mapper.js";
import { NotFoundError } from "../../error/externalhandling.error.js";
import { Request, Response } from "express";
import { TestcaseNewRequest } from "forge-shared/dto/request/testcasenewrequest.dto";

export default async function (req: Request, res: Response) {
	const testcaseNewRequest = req.body as TestcaseNewRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	let testcase: any;

	try {
		const acceptancecriteriaId = decryptPK("acceptancecriteria", testcaseNewRequest.acceptancecriteriaEid);
		const acceptancecriteria = await sequelize.models["acceptancecriteria"].findByPk(acceptancecriteriaId, {
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
			transaction,
		});

		const acceptancecriteriaProjectId = acceptancecriteria?.dataValues.userstory?.dataValues.epic?.dataValues.projectId;
		if (acceptancecriteriaProjectId !== authProject.project.dataValues.id) {
			throw new NotFoundError("Acceptance criteria not found or does not belong to the project");
		}

		testcase = await sequelize.models["testcase"].create(
			{
				acceptancecriteriumId: acceptancecriteriaId,
				description: testcaseNewRequest.description,
				precondition: testcaseNewRequest.precondition,
				testcasesteps: testcaseNewRequest.steps,
			},
			{ include: [{ model: sequelize.models["testcasestep"] }], transaction },
		);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapTestcaseResponse(testcase);
	res.status(200).send(response);
}
