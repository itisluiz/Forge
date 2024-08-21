/**
 * @swagger
 * components:
 *   schemas:
 *     EpicResponse:
 *       type: object
 *       properties:
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
	title: string;
	description: string;
	projectId: string;
}
