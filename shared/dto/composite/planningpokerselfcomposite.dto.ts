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
 *         userstoryCount:
 *           type: number
 *         participantCount:
 *           type: number
 */
export interface PlanningpokerSelfComposite {
	sessionCode: string;
	agenda: string;
	userstoryCount: number;
	participantCount: number;
}
