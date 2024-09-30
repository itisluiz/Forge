import { TestcaseStepComposite } from "../composite/testcasestepcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     TestcaseNewRequest:
 *       type: object
 *       properties:
 *         acceptancecriteriaEid:
 *           type: string
 *         description:
 *           type: string
 *         precondition:
 *           type: string
 *         steps:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TestcaseStepComposite'
 */
export interface TestcaseNewRequest {
	acceptancecriteriaEid: string;
	description: string;
	precondition: string;
	steps: TestcaseStepComposite[];
}
