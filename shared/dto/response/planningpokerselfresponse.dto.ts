import { PlanningpokerSelfComposite } from "../composite/planningpokerselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     PlanningpokerSelfResponse:
 *       type: object
 *       properties:
 *         pokerSessions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlanningpokerSelfComposite'
 */
export interface PlanningpokerSelfResponse {
	pokerSessions: PlanningpokerSelfComposite[];
}
