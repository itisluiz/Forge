import { getProjectData } from "../../util/requestmeta.js";
import { getSequelize } from "../../util/sequelize.js";
import { Request, Response } from "express";
import { TestcaseStepComposite } from "forge-shared/dto/composite/testcasestepcomposite.dto.js";
import { TestcaseSuggestionRequest } from "forge-shared/dto/request/testcasesuggestionrequest.dto";
import { TestcaseSuggestionResponse } from "forge-shared/dto/response/testcasesuggestionresponse.dto";

export default async function (req: Request, res: Response) {
	const testcaseSuggestionRequest = req.body as TestcaseSuggestionRequest;
	const sequelize = await getSequelize();
	const transaction = await sequelize.transaction();
	const authProject = getProjectData(req);

	try {
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}

	const steps: TestcaseStepComposite[] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
		action: `Sample action #${i + 1}`,
		expectedBehavior: `Sample expected behavior #${i + 1}`,
	}));

	const response: TestcaseSuggestionResponse = {
		description: testcaseSuggestionRequest.prompt
			? `Your prompt was '${testcaseSuggestionRequest.prompt}'`
			: "No prompt was provided",
		precondition: `This test case has ${steps.length} step(s) for the acceptance criteria of eid ${testcaseSuggestionRequest.acceptancecriteriaEid}`,
		steps: steps,
	};
	res.status(200).send(response);
}
