import { mapUserstorySelfComposite } from "../composite/userstoryselfcomposite.mapper.js";
import { UserstorySelfResponse } from "forge-shared/dto/response/userstoryselfresponse.dto";

export function mapUserstorySelfResponse(userstories: any): UserstorySelfResponse {
	return {
		userstories: userstories.map(mapUserstorySelfComposite),
	};
}
