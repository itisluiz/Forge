import { ProjectRole } from "../../enum/projectrole.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectMakeInvitationRequest:
 *       type: object
 *       properties:
 *         uses:
 *           type: integer
 *         durationHours:
 *           type: number
 *         role:
 *           $ref: '#/components/schemas/ProjectRole'
 */
export interface ProjectMakeInvitationRequest {
	uses: number;
	durationHours: number;
	role: ProjectRole;
}
