import { ProjectRole } from "../../enum/projectrole.enum";

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
 *           $ref: '#/components/schemas/ProjectRole'
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         surname:
 *           type: string
 *         gravatar:
 *           type: string
 *           format: uri
 *         joinedAt:
 *           type: string
 *           format: date-time
 */
export interface ProjectMemberComposite {
	eid: string;
	admin: boolean;
	role: ProjectRole;
	email: string;
	name: string;
	surname: string;
	gravatar: string;
	joinedAt: string;
}
