import { ProjectInvitationComposite } from "../composite/projectinvitationcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectMakeInvitationResponse:
 *       type: object
 *       properties:
 *         invitation:
 *           $ref: '#/components/schemas/ProjectInvitationComposite'
 */
export interface ProjectMakeInvitationResponse {
	invitation: ProjectInvitationComposite;
}
