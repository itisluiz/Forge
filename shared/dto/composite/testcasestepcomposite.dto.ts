/**
 * @swagger
 * components:
 *   schemas:
 *     TestcaseStepComposite:
 *       type: object
 *       properties:
 *         action:
 *           type: string
 *         expectedBehavior:
 *           type: string
 */
export interface TestcaseStepComposite {
	action: string;
	expectedBehavior: string;
}
