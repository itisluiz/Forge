import { SprintStatus } from "../../enum/sprintstatus.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     SprintNewRequest:
 *       type: object
 *       properties:
 *         startsAt:
 *           type: string
 *           format: date-time
 *         endsAt:
 *           type: string
 *           format: date-time
 *         status:
 *           $ref: '#/components/schemas/SprintStatus'
 */
export interface SprintNewRequest {
	startsAt: string;
	endsAt: string;
	status: SprintStatus;
}
