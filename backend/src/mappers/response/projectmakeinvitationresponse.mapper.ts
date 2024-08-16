import { mapProjectInvitationComposite } from "../composite/projectinvitationcomposite.mapper.js";
import { ProjectMakeInvitationResponse } from "forge-shared/dto/response/projectmakeinvitationresponse.dto.js";

export function mapProjectMakeInvitationResponse(invitation: any): ProjectMakeInvitationResponse {
	return {
		invitation: mapProjectInvitationComposite(invitation),
	};
}
