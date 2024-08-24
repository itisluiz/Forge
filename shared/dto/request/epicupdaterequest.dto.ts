/**
 * @swagger
 * components:
 *   schemas:
 *     EpicUpdateRequest:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           nullable: true
 *         title:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 */
export interface EpicUpdateRequest {
	code?: string;
	title?: string;
	description?: string;
}
