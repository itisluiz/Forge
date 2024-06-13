import { NewTestCase } from "forge-shared/dto/newtestcase.dto";
import { Response } from "express";
import { getSequelize } from "../../util/sequelize.js";

export default async function (req: Request, res: Response) {
	const sequelize = await getSequelize();
	const newTestCase: NewTestCase = req.body as any as NewTestCase;

	const testCase = await sequelize.models["testcase"].create({
		acceptancecriteriumId: newTestCase.acceptanceCriteriaId,
		title: newTestCase.title,
	});

	await sequelize.models["testcasestep"].bulkCreate(
		newTestCase.steps.map((step) => ({
			testcaseId: testCase.dataValues.id,
			description: step,
		})),
	);

	res.send();
}
