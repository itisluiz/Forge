import { Injectable } from "@angular/core";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { ProjectRole } from "forge-shared/enum/projectrole.enum";

@Injectable({
	providedIn: "root",
})
export class UserPermsService {
	constructor() {}

	public checkUserPerms(projectMember: ProjectMemberComposite | undefined, acceptedRoles: ProjectRole[]) {
		if (!projectMember) {
			return false;
		}

		return projectMember.admin || acceptedRoles.includes(projectMember.role);
	}
}
