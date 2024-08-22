/**
 * @swagger
 * components:
 *   schemas:
 *     EpicNewRequest:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 */
export interface EpicNewRequest {
	code: string;
	title: string;
	description: string;
}
