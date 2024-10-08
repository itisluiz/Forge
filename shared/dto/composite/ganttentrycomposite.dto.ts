/**
 * @swagger
 * components:
 *   schemas:
 *     GanttEntryComposite:
 *       type: object
 *       properties:
 *         taskEid:
 *           type: string
 *         taskCode:
 *           type: string
 *         startedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
export interface GanttEntryComposite {
	taskEid: string;
	taskCode: string;
	startedAt?: string;
	completedAt?: string;
}
