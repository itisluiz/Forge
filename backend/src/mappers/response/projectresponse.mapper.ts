import { encryptPK } from "../../util/encryption.js";
import { mapProjectMemberComposite } from "../composite/projectmembercomposite.mapper.js";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto.js";

export function mapProjectResponse(project: any): ProjectResponse {
	return {
		eid: encryptPK("project", project.dataValues.id),
		code: project.dataValues.code,
		title: project.dataValues.title,
		description: project.dataValues.description,
		members: project.dataValues.users.map(mapProjectMemberComposite),
	};
}