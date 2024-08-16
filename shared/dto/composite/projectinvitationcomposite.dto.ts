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
 *         uses:
 *           type: integer
 *         durationHours:
 *           type: number
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
	uses: number;
	durationHours: number;
	createdAt: string;
	expiredAt?: string;
}
