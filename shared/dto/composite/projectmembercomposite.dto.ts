import { ProjectRoleComposite } from "./projectrolecomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectMemberComposite:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         admin:
 *           type: boolean
 *         role:
 *           $ref: '#/components/schemas/ProjectRoleComposite'
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         surname:
 *           type: string
 *         joinedAt:
 *           type: string
 *           format: date-time
 */
export interface ProjectMemberComposite {
	eid: string;
	admin: boolean;
	role: ProjectRoleComposite;
	email: string;
	name: string;
	surname: string;
	joinedAt: string;
}
