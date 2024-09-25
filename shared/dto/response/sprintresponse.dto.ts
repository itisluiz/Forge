import { SprintPeriodStatus } from "../../enum/sprintperiodstatus.enum";
import { SprintStatus } from "../../enum/sprintstatus.enum";
import { TaskSelfComposite } from "../composite/taskselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     SprintResponse:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         startsAt:
 *           type: string
 *           format: date-time
 *         endsAt:
 *           type: string
 *           format: date-time
 *         status:
 *           $ref: '#/components/schemas/SprintStatus'
 *         periodStatus:
 *           $ref: '#/components/schemas/SprintPeriodStatus'
 *         targetVelocity:
 *           type: number
 *           nullable: true
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskSelfComposite'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface SprintResponse {
	eid: string;
	startsAt: string;
	endsAt: string;
	status: SprintStatus;
	periodStatus: SprintPeriodStatus;
	targetVelocity?: number;
	tasks: TaskSelfComposite[];
	createdAt: string;
	updatedAt: string;
}
