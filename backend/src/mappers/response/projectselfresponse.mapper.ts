import { mapProjectSelfComposite } from "../composite/projectselfcomposite.mapper.js";
import { Model } from "sequelize";
import { ProjectSelfResponse } from "forge-shared/dto/response/projectselfresponse.dto";

export function mapProjectSelfResponse(projects: Model<any, any>[]): ProjectSelfResponse {
	return {
		projects: projects.map(mapProjectSelfComposite),
	};
}
