import { mapSprintSelfComposite } from "../composite/sprintselfcomposite.mapper.js";
import { SprintSelfResponse } from "forge-shared/dto/response/sprintselfresponse.dto";

export function mapSprintSelfResponse(sprints: any): SprintSelfResponse {
	return {
		sprints: sprints.map(mapSprintSelfComposite),
	};
}
