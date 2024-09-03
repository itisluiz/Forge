import { mapEpicSelfComposite } from "../composite/epicselfcomposite.mapper.js";
import { EpicSelfResponse } from "forge-shared/dto/response/epicselfresponse.dto";

export function mapEpicSelfResponse(epics: any, projectCode: string): EpicSelfResponse {
	return {
		epics: epics.map((epic: any) => mapEpicSelfComposite(epic, projectCode)),
	};
}
