/**
 * @swagger
 * components:
 *   schemas:
 *     EpicResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         projectId:
 *           type: string
 */
export interface EpicResponse {
	id: number;
	code: string;
	title: string;
	description: string;
	projectId: string;
}
