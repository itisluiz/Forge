import { BurndownEntryComposite } from "../composite/burndownentrycomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     BurndownResponse:
 *       type: object
 *       properties:
 *         startsAt:
 *           type: string
 *           format: date-time
 *         endsAt:
 *           type: string
 *           format: date-time
 *         maxEffort:
 *           type: number
 *         remaningEffort:
 *           type: number
 *         days:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BurndownEntryComposite'
 */
export interface BurndownResponse {
	startsAt: string;
	endsAt: string;
	maxEffort: number;
	remaningEffort: number;
	days: BurndownEntryComposite[];
}
