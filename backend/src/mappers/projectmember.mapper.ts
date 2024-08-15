import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { Model } from "sequelize";
import { encryptPK } from "../util/encryption.js";
import { mapProjectRole } from "./projectrole.mapper.js";

export function mapProjectMember(user: Model<any, any>): ProjectMemberComposite {
	return {
		eid: encryptPK("user", user.dataValues.id),
		admin: user.dataValues.projectmembership.isAdmin,
		role: mapProjectRole(user.dataValues.projectmembership.dataValues.eprojectrole),
		email: user.dataValues.email,
		name: user.dataValues.name,
		surname: user.dataValues.surname,
		joinedAt: user.dataValues.projectmembership.dataValues.createdAt,
	};
}
