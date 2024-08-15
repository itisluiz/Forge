/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectNewRequest:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 */
export interface ProjectNewRequest {
	code: string;
	title: string;
	description: string;
}
