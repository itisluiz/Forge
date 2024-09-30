import { encryptPK } from "../../util/encryption.js";
import { TestcaseSelfComposite } from "forge-shared/dto/composite/testcaseselfcomposite.dto.js";

export function mapTestcaseSelfComposite(testcase: any): TestcaseSelfComposite {
	return {
		eid: encryptPK("testcase", testcase.dataValues.id),
		description: testcase.dataValues.description,
		precondition: testcase.dataValues.precondition,
		stepCount: testcase.dataValues.testcasesteps.length,
	};
}
