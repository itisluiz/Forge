import { ProjectInvitationComposite } from "forge-shared/dto/composite/projectinvitationcomposite.dto";

export function mapProjectInvitationComposite(invitation: any): ProjectInvitationComposite {
	return {
		code: invitation.dataValues.code,
		role: invitation.dataValues.eprojectroleId,
		remainingUses: invitation.dataValues.remainingUses,
		durationHours: invitation.dataValues.durationHours,
		expired: invitation.isExpired(),
		createdAt: invitation.dataValues.createdAt,
		expiredAt: invitation.isExpired() ? invitation.expirationDate() : undefined,
	};
}
