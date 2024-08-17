/**
 * @swagger
 * components:
 *   schemas:
 *     EpicResponse:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         projectId:
 *           type: string
 */
export interface EpicResponse {
	title: string;
	description: string;
	projectId: string;
}
