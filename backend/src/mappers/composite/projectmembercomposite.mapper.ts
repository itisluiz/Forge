import { encryptPK } from "../../util/encryption.js";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";

export function mapProjectMemberComposite(user: any): ProjectMemberComposite {
	return {
		eid: encryptPK("user", user.dataValues.id),
		admin: user.dataValues.projectmembership.isAdmin,
		role: user.dataValues.projectmembership.dataValues.eprojectroleId,
		email: user.dataValues.email,
		name: user.dataValues.name,
		surname: user.dataValues.surname,
		joinedAt: user.dataValues.projectmembership.dataValues.createdAt,
	};
}
