/**
 * @swagger
 * components:
 *   schemas:
 *     NewTestCase:
 *       type: object
 *       properties:
 *         acceptanceCriteriaId:
 *           type: number
 *         title:
 *           type: string
 *         steps:
 *           type: array
 *           items:
 *             type: string
 */
export interface NewTestCase {
	acceptanceCriteriaId: number;
	title: string;
	steps: string[];
}
