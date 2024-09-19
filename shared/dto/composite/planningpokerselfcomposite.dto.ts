/**
 * @swagger
 * components:
 *   schemas:
 *     PlanningpokerSelfComposite:
 *       type: object
 *       properties:
 *         sessionCode:
 *           type: string
 *         agenda:
 *           type: string
 *         taskCount:
 *           type: number
 *         participantCount:
 *           type: number
 */
export interface PlanningpokerSelfComposite {
	sessionCode: string;
	agenda: string;
	taskCount: number;
	participantCount: number;
}
