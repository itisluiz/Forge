/**
 * @swagger
 * components:
 *   schemas:
 *     EpicUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 */
export interface EpicUpdateRequest {
	title?: string;
	description?: string;
}
