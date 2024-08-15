import { Model } from "sequelize";
import { ProjectRoleComposite } from "forge-shared/dto/composite/projectrolecomposite.dto";

export function mapProjectRole(projectRole: Model<any, any>): ProjectRoleComposite {
	return {
		enum: projectRole.dataValues.id,
		title: projectRole.dataValues.title,
	};
}
