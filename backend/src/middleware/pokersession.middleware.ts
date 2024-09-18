import { authorizeProject } from "./authproject.middleware.js";
import { getProjectData, getUserData, setPlanningpokerData } from "../util/requestmeta.js";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../error/externalhandling.error.js";
import { planningpoker } from "../session/planningpoker.session.js";
import { ProjectRole } from "forge-shared/enum/projectrole.enum.js";

export function pokerSession(scrumMaster = false) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const authUser = getUserData(req);
		const planningPokerSession = planningpoker.get(req.params["sessionCode"]);

		if (
			planningPokerSession &&
			planningPokerSession.participants.every(
				(participant) => participant.user.dataValues.id !== authUser.user.dataValues.id,
			)
		) {
			await authorizeProject(false, scrumMaster ? [ProjectRole.SCRUM_MASTER] : null)(req, res, () => {});
			const authProject = getProjectData(req);

			if (planningPokerSession.project.dataValues.id !== authProject.project.dataValues.id) {
				throw new NotFoundError("This planning poker session doesn't exist or isn't part of this project");
			}
		} else if (!planningPokerSession) {
			throw new NotFoundError("This planning poker session doesn't exist or isn't part of this project");
		}

		planningpoker.heartbeatParticipant(planningPokerSession, authUser.user);
		setPlanningpokerData(req, planningPokerSession);
		next();
	};
}
