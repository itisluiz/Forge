/**
 * @swagger
 * components:
 *   schemas:
 *     EpicSelfComposite:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 */
export interface EpicSelfComposite {
	eid: string;
	code: string;
	title: string;
	description: string;
}
