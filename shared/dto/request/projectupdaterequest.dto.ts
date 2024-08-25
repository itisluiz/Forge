/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectUpdateRequest:
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
export interface ProjectUpdateRequest {
	code?: string;
	title?: string;
	description?: string;
}
