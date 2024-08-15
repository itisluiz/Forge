import { ProjectRole } from "../../enum/projectrole.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectRoleComposite:
 *       type: object
 *       properties:
 *         enum:
 *           $ref: '#/components/schemas/ProjectRole'
 *         title:
 *           type: string
 */
export interface ProjectRoleComposite {
	enum: ProjectRole;
	title: string;
}
