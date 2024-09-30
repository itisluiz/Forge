/**
 * @swagger
 * components:
 *   schemas:
 *     TestcaseSelfComposite:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         description:
 *           type: string
 *         precondition:
 *           type: string
 *         stepCount:
 *           type: number
 */
export interface TestcaseSelfComposite {
	eid: string;
	description: string;
	precondition: string;
	stepCount: number;
}
