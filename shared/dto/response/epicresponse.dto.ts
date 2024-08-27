import { UserstorySelfComposite } from "../composite/userstoryselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     EpicResponse:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         userstories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserstorySelfComposite'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface EpicResponse {
	eid: string;
	code: string;
	title: string;
	description: string;
	userstories: UserstorySelfComposite[];
	createdAt: string;
	updatedAt: string;
}
