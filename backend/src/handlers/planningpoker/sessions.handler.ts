import { getProjectData } from "../../util/requestmeta.js";
import { mapPlanningpokerSelfResponse } from "../../mappers/response/planningpokerselfresponse.mapper.js";
import { planningpoker } from "../../session/planningpoker.session.js";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const authProject = getProjectData(req);
	const sessions = planningpoker.getByProjectId(authProject.project.dataValues.id);

	const response = mapPlanningpokerSelfResponse(sessions);
	res.status(200).send(response);
}
