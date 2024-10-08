import { SprintStatus } from "../../enum/sprintstatus.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     SprintUpdateRequest:
 *       type: object
 *       properties:
 *         startsAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         endsAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/SprintStatus'
 *           nullable: true
 *         targetVelocity:
 *           type: number
 *           nullable: true
 */
export interface SprintUpdateRequest {
	startsAt?: string;
	endsAt?: string;
	status?: SprintStatus;
	targetVelocity?: number | null;
}
