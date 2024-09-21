import { PlanningpokerParticipantComposite } from "../composite/planningpokerparticipantcomposite.dto";
import { SprintSelfComposite } from "../composite/sprintselfcomposite.dto";
import { UserstorySelfComposite } from "../composite/userstoryselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     PlanningpokerResponse:
 *       type: object
 *       properties:
 *         agenda:
 *           type: string
 *         sprint:
 *           $ref: '#/components/schemas/SprintSelfComposite'
 *         userstories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserstorySelfComposite'
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlanningpokerParticipantComposite'
 *         selectedUserstoryEid:
 *           type: string
 *           nullable: true
 *         revealed:
 *           type: boolean
 *         voteAverage:
 *           type: number
 *           nullable: true
 *         voteClosestFibonacci:
 *           type: number
 *           nullable: true
 */
export interface PlanningpokerResponse {
	agenda: string;
	sprint: SprintSelfComposite;
	userstories: UserstorySelfComposite[];
	participants: PlanningpokerParticipantComposite[];
	selectedUserstoryEid: string | null;
	revealed: boolean;
	voteAverage?: number | null;
	voteClosestFibonacci?: number | null;
}
