/**
 * @swagger
 * components:
 *   schemas:
 *     EpicResponse:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface EpicResponse {
	eid: string;
	code: string;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}
