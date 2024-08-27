import { encryptPK } from "../../util/encryption.js";
import { EpicResponse } from "forge-shared/dto/response/epicresponse.dto.js";
import { mapUserstorySelfComposite } from "../composite/userstoryselfcomposite.mapper.js";

export function mapEpicResponse(epic: any): EpicResponse {
	return {
		eid: encryptPK("epic", epic.dataValues.id),
		code: epic.dataValues.code,
		title: epic.dataValues.title,
		description: epic.dataValues.description,
		userstories: epic.dataValues.userstories.map(mapUserstorySelfComposite),
		createdAt: epic.dataValues.createdAt,
		updatedAt: epic.dataValues.updatedAt,
	};
}
