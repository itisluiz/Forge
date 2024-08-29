import { AcceptanceCriteriaSelfResponse } from "forge-shared/dto/response/acceptancecriteriaselfresponse.dto";
import { mapAcceptanceCriteriaSelfComposite } from "../composite/acceptancecriteriaselfcomposite.mapper.js";

export function mapAcceptanceCriteriaSelfResponse(acceptancecriteria: any): AcceptanceCriteriaSelfResponse {
	return {
		acceptanceCriteria: acceptancecriteria.map(mapAcceptanceCriteriaSelfComposite),
	};
}
