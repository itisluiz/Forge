/**
 * @swagger
 * components:
 *   schemas:
 *     AITestCase:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         steps:
 *           type: array
 *           items:
 *             type: string
 */
export interface AITestCase {
	title: string;
	steps: string[];
}
