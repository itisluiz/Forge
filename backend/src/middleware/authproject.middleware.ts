import { decryptPK } from "../util/encryption.js";
import { getSequelize } from "../util/sequelize.js";
import { getUserData, setProjectData } from "../util/requestmeta.js";
import { NextFunction, Request, Response } from "express";
import { ProjectRole } from "forge-shared/enum/projectrole.enum.js";
import { UnauthorizedError } from "../error/externalhandling.error.js";

export function authorizeProject(admin = false, roles: ProjectRole[] | null = null) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const projectId = decryptPK("project", req.params["projectEid"]);
		const sequelize = await getSequelize();
		const authUser = getUserData(req);

		const project = await sequelize.models["project"].findByPk(projectId, {
			include: [{ model: sequelize.models["user"], attributes: ["id"], where: { id: authUser.user.dataValues.id } }],
			attributes: ["id", "code", "epicIndex", "userstoryIndex", "taskIndex"],
		});

		if (project) {
			const projectMember = project.dataValues.users.find((user: any) => user.id === authUser.user.dataValues.id);
			if (!projectMember) {
				throw new UnauthorizedError("This project doen't exist or you don't have access to it");
			}

			if (admin && !projectMember.dataValues.projectmembership.isAdmin) {
				throw new UnauthorizedError("You must be a project admin to perform this action");
			}

			if (!admin && roles && !roles.includes(projectMember.dataValues.projectmembership.eprojectroleId)) {
				throw new UnauthorizedError("You don't have the required role to perform this action");
			}

			setProjectData(req, project, projectMember.dataValues.projectmembership);
		} else {
			throw new UnauthorizedError("This project doen't exist or you don't have access to it");
		}

		next();
	};
}
