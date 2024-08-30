import { AuthToken } from "forge-shared/dto/authtoken.dto";
import { Model } from "sequelize";
import { ProjectRole } from "forge-shared/enum/projectrole.enum";
import { Request } from "express";

//#region setters
export function setUserData(req: Request, user: Model<any, any>, authToken: AuthToken) {
	(req as any).__reqinjection_user = user;
	(req as any).__reqinjection_authtoken = authToken;
}

export function setProjectData(req: Request, project: Model<any, any>, projectmembership: Model<any, any>) {
	(req as any).__reqinjection_project = project;
	(req as any).__reqinjection_projectadmin = projectmembership.dataValues.isAdmin;
	(req as any).__reqinjection_projectrole = projectmembership.dataValues.eprojectroleId;
}
//#endregion

//#region getters
export function getUserData(req: Request) {
	return {
		user: (req as any).__reqinjection_user as any,
		authToken: (req as any).__reqinjection_authtoken as AuthToken,
	};
}

export function getProjectData(req: Request) {
	return {
		project: (req as any).__reqinjection_project as any,
		projectAdmin: (req as any).__reqinjection_projectadmin as boolean,
		projectRole: (req as any).__reqinjection_projectrole as ProjectRole,
	};
}
//#endregion
