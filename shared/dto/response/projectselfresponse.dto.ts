import { ProjectSelfComposite } from "../composite/projectselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectSelfResponse:
 *       type: object
 *       properties:
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectSelfComposite'
 */
export interface ProjectSelfResponse {
	projects: ProjectSelfComposite[];
}
