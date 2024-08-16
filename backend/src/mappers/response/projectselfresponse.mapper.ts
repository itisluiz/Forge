import { mapProjectSelfComposite } from "../composite/projectselfcomposite.mapper.js";
import { ProjectSelfResponse } from "forge-shared/dto/response/projectselfresponse.dto";

export function mapProjectSelfResponse(projects: any): ProjectSelfResponse {
	return {
		projects: projects.map(mapProjectSelfComposite),
	};
}
