import { ProjectInvitationComposite } from "forge-shared/dto/composite/projectinvitationcomposite.dto";

export function mapProjectInvitationComposite(invitation: any): ProjectInvitationComposite {
	return {
		code: invitation.dataValues.code,
		role: invitation.dataValues.eprojectroleId,
		uses: invitation.dataValues.uses,
		durationHours: invitation.dataValues.durationHours,
		createdAt: invitation.dataValues.createdAt,
		expiredAt: invitation.isExpired() ? invitation.expirationDate() : undefined,
	};
}
