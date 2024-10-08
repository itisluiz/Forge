/**
 * @swagger
 * components:
 *   schemas:
 *     PlanningpokerCreatesessionRequest:
 *       type: object
 *       properties:
 *         agenda:
 *           type: string
 *         sprintEid:
 *           type: string
 */
export interface PlanningpokerCreatesessionRequest {
	agenda: string;
	sprintEid: string;
}
