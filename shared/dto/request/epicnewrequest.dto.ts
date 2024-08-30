/**
 * @swagger
 * components:
 *   schemas:
 *     EpicNewRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 */
export interface EpicNewRequest {
	title: string;
	description: string;
}
