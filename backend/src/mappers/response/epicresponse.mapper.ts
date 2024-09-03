import { encryptPK } from "../../util/encryption.js";
import { EpicResponse } from "forge-shared/dto/response/epicresponse.dto.js";
import { mapUserstorySelfComposite } from "../composite/userstoryselfcomposite.mapper.js";

export function mapEpicResponse(epic: any, projectCode: string): EpicResponse {
	return {
		eid: encryptPK("epic", epic.dataValues.id),
		code: `${projectCode}-EPC-${epic.dataValues.index}`,
		title: epic.dataValues.title,
		description: epic.dataValues.description,
		userstories: epic.dataValues.userstories.map((userstory: any) => mapUserstorySelfComposite(userstory, projectCode)),
		createdAt: epic.dataValues.createdAt,
		updatedAt: epic.dataValues.updatedAt,
	};
}
