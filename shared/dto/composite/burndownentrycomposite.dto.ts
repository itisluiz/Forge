/**
 * @swagger
 * components:
 *   schemas:
 *     BurndownEntryComposite:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *         effort:
 *           type: number
 */
export interface BurndownEntryComposite {
	date: string;
	effort: number;
}
