import { TestcaseStepComposite } from "forge-shared/dto/composite/testcasestepcomposite.dto.js";

export function mapTestcaseStepComposite(testcaseStep: any): TestcaseStepComposite {
	return {
		action: testcaseStep.dataValues.action,
		expectedBehavior: testcaseStep.dataValues.expectedBehavior,
	};
}
