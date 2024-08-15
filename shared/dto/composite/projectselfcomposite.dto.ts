import { ProjectRole } from "../../enum/projectrole.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectSelfComposite:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         admin:
 *           type: boolean
 *         role:
 *           $ref: '#/components/schemas/ProjectRole'
 *         joinedAt:
 *           type: string
 *           format: date-time
 */
export interface ProjectSelfComposite {
	eid: string;
	code: string;
	title: string;
	admin: boolean;
	role: ProjectRole;
	joinedAt: string;
}
