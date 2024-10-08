import { decryptPK } from "../../util/encryption.js";
import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { mapTestcaseResponse } from "../../mappers/response/testcaseresponse.mapper.js";
import { NotFoundError } from "../../error/externalhandling.error.js";
import { Request, Response } from "express";
import { TestcaseUpdateRequest } from "forge-shared/dto/request/testcaseupdaterequest.dto";

export default async function (req: Request, res: Response) {
	const testcaseUpdateRequest = req.body as TestcaseUpdateRequest;
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

		if (testcaseUpdateRequest.steps) {
			const currentSteps = new Set(
				testcase.testcasesteps.map((step: any) => `${step.dataValues.action}:${step.dataValues.expectedBehavior}`),
			);
			const newSteps = new Set(testcaseUpdateRequest.steps.map((step) => `${step.action}:${step.expectedBehavior}`));

			const stepsChanged = currentSteps.size !== newSteps.size || [...currentSteps].some((step: any) => !newSteps.has(step));
			if (stepsChanged) {
				const steps = testcaseUpdateRequest.steps.map((step) => ({
					testcaseId: testcaseId,
					action: step.action,
					expectedBehavior: step.expectedBehavior,
				}));

				await sequelize.models["testcasestep"].destroy({ where: { testcaseId: testcaseId }, transaction });
				await sequelize.models["testcasestep"].bulkCreate(steps, { transaction });
			}
		}

		testcase.set(
			{
				...(testcaseUpdateRequest.description && { description: testcaseUpdateRequest.description }),
				...(testcaseUpdateRequest.precondition && { precondition: testcaseUpdateRequest.precondition }),
				...(testcaseUpdateRequest.steps && { testcasesteps: testcaseUpdateRequest.steps }),
			},
			{ transaction },
		);

		await testcase.save({ transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const response = mapTestcaseResponse(testcase);
	res.status(200).send(response);
}
