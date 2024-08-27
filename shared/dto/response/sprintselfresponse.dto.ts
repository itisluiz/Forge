import { SprintSelfComposite } from "../composite/sprintselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     SprintSelfResponse:
 *       type: object
 *       properties:
 *         sprints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SprintSelfComposite'
 */
export interface SprintSelfResponse {
	sprints: SprintSelfComposite[];
}
