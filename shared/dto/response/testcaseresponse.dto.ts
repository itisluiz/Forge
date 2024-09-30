import { TestcaseStepComposite } from "../composite/testcasestepcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     TestcaseResponse:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
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
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface TestcaseResponse {
	eid: string;
	acceptancecriteriaEid: string;
	description: string;
	precondition: string;
	steps: TestcaseStepComposite[];
	createdAt: string;
	updatedAt: string;
}
