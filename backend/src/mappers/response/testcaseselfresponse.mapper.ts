import { mapTestcaseSelfComposite } from "../composite/testcaseselfcomposite.mapper.js";
import { TestcaseSelfResponse } from "forge-shared/dto/response/testcaseselfresponse.dto";

export function mapTestcaseSelfResponse(testcases: any): TestcaseSelfResponse {
	return {
		testcases: testcases.map(mapTestcaseSelfComposite),
	};
}
