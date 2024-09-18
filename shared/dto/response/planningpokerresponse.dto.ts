import { PlanningpokerParticipantComposite } from "../composite/planningpokerparticipantcomposite.dto";
import { TaskSelfComposite } from "../composite/taskselfcomposite.dto";
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
 *         userstories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserstorySelfComposite'
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskSelfComposite'
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlanningpokerParticipantComposite'
 *         selectedTaskEid:
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
	userstories: UserstorySelfComposite[];
	tasks: TaskSelfComposite[];
	participants: PlanningpokerParticipantComposite[];
	selectedTaskEid: string | null;
	revealed: boolean;
	voteAverage?: number | null;
	voteClosestFibonacci?: number | null;
}
