import { TestcaseSelfComposite } from "../composite/testcaseselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     TestcaseSelfResponse:
 *       type: object
 *       properties:
 *         testcases:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TestcaseSelfComposite'
 */
export interface TestcaseSelfResponse {
	testcases: TestcaseSelfComposite[];
}
