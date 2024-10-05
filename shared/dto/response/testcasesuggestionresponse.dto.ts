import { TestcaseStepComposite } from "../composite/testcasestepcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     TestcaseSuggestionResponse:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         precondition:
 *           type: string
 *         steps:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TestcaseStepComposite'
 */
export interface TestcaseSuggestionResponse {
	description: string;
	precondition: string;
	steps: TestcaseStepComposite[];
}
