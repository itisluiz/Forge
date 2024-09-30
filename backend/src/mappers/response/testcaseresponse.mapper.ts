import { encryptPK } from "../../util/encryption.js";
import { mapTestcaseStepComposite } from "../composite/testcasestepcomposite.mapper.js";
import { TestcaseResponse } from "forge-shared/dto/response/testcaseresponse.dto";

export function mapTestcaseResponse(testcase: any): TestcaseResponse {
	return {
		eid: encryptPK("testcase", testcase.dataValues.id),
		acceptancecriteriaEid: encryptPK("acceptancecriteria", testcase.dataValues.acceptancecriteriumId),
		description: testcase.dataValues.description,
		precondition: testcase.dataValues.precondition,
		steps: testcase.dataValues.testcasesteps.map(mapTestcaseStepComposite),
		createdAt: testcase.dataValues.createdAt,
		updatedAt: testcase.dataValues.updatedAt,
	};
}
