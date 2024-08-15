import { encryptPK } from "../../util/encryption.js";
import { Model } from "sequelize";
import { ProjectSelfComposite } from "forge-shared/dto/composite/projectselfcomposite.dto";

export function mapProjectSelfComposite(project: Model<any, any>): ProjectSelfComposite {
	return {
		eid: encryptPK("project", project.dataValues.id),
		code: project.dataValues.code,
		title: project.dataValues.title,
		admin: project.dataValues.projectmembership.isAdmin,
		role: project.dataValues.projectmembership.dataValues.eprojectroleId,
		joinedAt: project.dataValues.projectmembership.dataValues.createdAt,
	};
}
