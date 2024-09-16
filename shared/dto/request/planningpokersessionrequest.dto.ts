/**
 * @swagger
 * components:
 *   schemas:
 *     PlanningpokerSessionRequest:
 *       type: object
 *       properties:
 *         agenda:
 *           type: string
 *         userstoryEids:
 *           type: array
 *           items:
 *             type: string
 */
export interface PlanningpokerSessionRequest {
	agenda: string;
	userstoryEids: string[];
}
