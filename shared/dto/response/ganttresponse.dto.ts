import { GanttEntryComposite } from "../composite/ganttentrycomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     GanttResponse:
 *       type: object
 *       properties:
 *         startsAt:
 *           type: string
 *           format: date-time
 *         endsAt:
 *           type: string
 *           format: date-time
 *         totalTasks:
 *           type: number
 *         remainingTasks:
 *           type: number
 *         days:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GanttEntryComposite'
 */
export interface GanttResponse {
	startsAt: string;
	endsAt: string;
	totalTasks: number;
	remainingTasks: number;
	tasks: GanttEntryComposite[];
}
