/**
 * @swagger
 * components:
 *   schemas:
 *     UserStory:
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
 *         tests:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 */
export interface UserStory {
	title: string;
	description: string;
	actor: string;
	objective: string;
	justification: string;
	acceptanceCriteria: {
		id: number;
		given: string;
		when: string;
		then: string;
		tests: { title: string; steps: { description: string }[] }[];
	}[];
}
