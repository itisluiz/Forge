/**
 * @swagger
 * components:
 *   schemas:
 *     PlanningpokerCreatesessionRequest:
 *       type: object
 *       properties:
 *         agenda:
 *           type: string
 *         userstoryEids:
 *           type: array
 *           items:
 *             type: string
 */
export interface PlanningpokerCreatesessionRequest {
	agenda: string;
	userstoryEids: string[];
}
