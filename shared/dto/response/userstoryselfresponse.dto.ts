import { UserstorySelfComposite } from "../composite/userstoryselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserstorySelfResponse:
 *       type: object
 *       properties:
 *         userstories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserstorySelfComposite'
 */
export interface UserstorySelfResponse {
	userstories: UserstorySelfComposite[];
}
