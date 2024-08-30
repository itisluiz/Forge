import { mapUserstorySelfComposite } from "../composite/userstoryselfcomposite.mapper.js";
import { UserstorySelfResponse } from "forge-shared/dto/response/userstoryselfresponse.dto";

export function mapUserstorySelfResponse(userstories: any, projectCode: string): UserstorySelfResponse {
	return {
		userstories: userstories.map((userstory: any) => mapUserstorySelfComposite(userstory, projectCode)),
	};
}
