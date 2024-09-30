import { TestcaseStepComposite } from "../composite/testcasestepcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     TestcaseUpdateRequest:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           nullable: true
 *         precondition:
 *           type: string
 *           nullable: true
 *         steps:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TestcaseStepComposite'
 *           nullable: true
 */
export interface TestcaseUpdateRequest {
	description?: string;
	precondition?: string;
	steps?: TestcaseStepComposite[];
}
