import { Model } from "sequelize";
import { encryptPK } from "../util/encryption.js";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto.js";
import { mapProjectMember } from "./projectmember.mapper.js";

export function mapProject(project: Model<any, any>): ProjectResponse {
	return {
		eid: encryptPK("project", project.dataValues.id),
		code: project.dataValues.code,
		title: project.dataValues.title,
		description: project.dataValues.description,
		members: project.dataValues.users.map(mapProjectMember),
	};
}
