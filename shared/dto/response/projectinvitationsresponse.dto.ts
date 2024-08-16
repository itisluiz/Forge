import { ProjectInvitationComposite } from "../composite/projectinvitationcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectInvitationsResponse:
 *       type: object
 *       properties:
 *         invitations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectInvitationComposite'
 */
export interface ProjectInvitationsResponse {
	invitations: ProjectInvitationComposite[];
}
