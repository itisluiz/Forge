import { SprintPeriodStatus } from "../../enum/sprintperiodstatus.enum";
import { SprintStatus } from "../../enum/sprintstatus.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     SprintSelfComposite:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         index:
 *           type: integer
 *           nullable: true
 *         startsAt:
 *           type: string
 *           format: date-time
 *         endsAt:
 *           type: string
 *           format: date-time
 *         status:
 *           $ref: '#/components/schemas/SprintStatus'
 *         periodStatus:
 *           $ref: '#/components/schemas/SprintPeriodStatus'
 *         targetVelocity:
 *           type: number
 *           nullable: true
 */
export interface SprintSelfComposite {
	eid: string;
	index?: number;
	startsAt: string;
	endsAt: string;
	status: SprintStatus;
	periodStatus: SprintPeriodStatus;
	targetVelocity?: number;
}
