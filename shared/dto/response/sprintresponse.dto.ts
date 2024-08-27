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
	tasks: TaskSelfComposite[];
	createdAt: string;
	updatedAt: string;
}
