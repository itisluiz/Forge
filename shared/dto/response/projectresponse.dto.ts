import { EpicSelfComposite } from "../composite/epicselfcomposite.dto";
import { ProjectMemberComposite } from "../composite/projectmembercomposite.dto";
import { ProjectRole } from "../../enum/projectrole.enum";

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
 *         admin:
 *           type: boolean
 *         role:
 *           $ref: '#/components/schemas/ProjectRole'
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectMemberComposite'
 *         epics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EpicSelfComposite'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface ProjectResponse {
	eid: string;
	code: string;
	title: string;
	description: string;
	admin: boolean;
	role: ProjectRole;
	members: ProjectMemberComposite[];
	epics: EpicSelfComposite[];
	createdAt: string;
	updatedAt: string;
}
