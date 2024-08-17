import { ProjectRole } from "../../enum/projectrole.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectInvitationComposite:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/ProjectRole'
 *         remainingUses:
 *           type: integer
 *         durationHours:
 *           type: number
 *         expired:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         expiredAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
export interface ProjectInvitationComposite {
	code: string;
	role: ProjectRole;
	remainingUses: number;
	durationHours: number;
	expired: boolean;
	createdAt: string;
	expiredAt?: string;
}
