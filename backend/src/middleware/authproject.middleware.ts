import { decryptPK } from "../util/encryption.js";
import { getSequelize } from "../util/sequelize.js";
import { NextFunction, Request, Response } from "express";
import { getUserData, setProjectData } from "../util/requestmeta.js";
import { UnauthorizedError } from "../error/externalhandling.error.js";

export function authorizeProject(admin = false) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const projectId = decryptPK("project", req.params["eid"]);
		const sequelize = await getSequelize();
		const authUser = getUserData(req);

		const project = await sequelize.models["project"].findByPk(projectId, { include: sequelize.models["user"] });

		if (project) {
			const projectMember = project.dataValues.users.find((user: any) => user.id === authUser.user.dataValues.id);
			if (!projectMember) {
				throw new UnauthorizedError("This project doen't exist or you don't have access to it");
			}

			if (admin && !projectMember.dataValues.projectmembership.isAdmin) {
				throw new UnauthorizedError("You must be a project admin to perform this action");
			}

			setProjectData(req, projectMember.dataValues.projectmembership, projectId);
		} else {
			throw new UnauthorizedError("This project doen't exist or you don't have access to it");
		}

		next();
	};
}