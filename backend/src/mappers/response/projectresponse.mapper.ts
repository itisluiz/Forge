import { encryptPK } from "../../util/encryption.js";
import { mapEpicSelfComposite } from "../composite/epicselfcomposite.mapper.js";
import { mapProjectMemberComposite } from "../composite/projectmembercomposite.mapper.js";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto.js";

export function mapProjectResponse(project: any, self: any): ProjectResponse {
	return {
		eid: encryptPK("project", project.dataValues.id),
		code: project.dataValues.code,
		title: project.dataValues.title,
		description: project.dataValues.description,
		admin: self.dataValues.projectmembership.isAdmin,
		role: self.dataValues.projectmembership.dataValues.eprojectroleId,
		members: project.dataValues.users.map(mapProjectMemberComposite),
		epics: project.dataValues.epics.map((epic: any) => mapEpicSelfComposite(epic, project.dataValues.code)),
		createdAt: project.dataValues.createdAt,
		updatedAt: project.dataValues.updatedAt,
	};
}
