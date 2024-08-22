/**
 * @swagger
 * components:
 *   schemas:
 *     EpicSelfComposite:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface EpicSelfComposite {
	id: string;
	code: string;
	title: string;
	description: boolean;
	createdAt: string;
	updatedAt: string;
}
