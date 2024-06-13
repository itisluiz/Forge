/**
 * @swagger
 * components:
 *   schemas:
 *     NewUserStory:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         actor:
 *           type: string
 *         objective:
 *           type: string
 *         justification:
 *           type: string
 *         acceptanceCriteria:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               given:
 *                 type: string
 *               when:
 *                 type: string
 *               then:
 *                 type: string
 */
export interface NewUserStory {
	title: string;
	description: string;
	actor: string;
	objective: string;
	justification: string;
	acceptanceCriteria: { given: string; when: string; then: string }[];
}
