import { ProjectMemberComposite } from "../composite/projectmembercomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectResponse:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectMemberComposite'
 */
export interface ProjectResponse {
	eid: string;
	code: string;
	title: string;
	description: string;
	members: ProjectMemberComposite[];
}
