import { mapEpicSelfComposite } from "../composite/epicselfcomposite.mapper.js";
import { EpicSelfResponse } from "forge-shared/dto/response/epicselfresponse.dto";

export function mapEpicSelfResponse(epics: any): EpicSelfResponse {
	return {
		epics: epics.map(mapEpicSelfComposite),
	};
}
