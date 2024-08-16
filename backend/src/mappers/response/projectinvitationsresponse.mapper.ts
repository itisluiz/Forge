import { mapProjectInvitationComposite } from "../composite/projectinvitationcomposite.mapper.js";
import { ProjectInvitationsResponse } from "forge-shared/dto/response/projectinvitationsresponse.dto.js";

export function mapProjectInvitationsResponse(invitations: any): ProjectInvitationsResponse {
	return {
		invitations: invitations.map(mapProjectInvitationComposite),
	};
}
