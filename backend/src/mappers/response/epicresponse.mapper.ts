import { encryptPK } from "../../util/encryption.js";
import { EpicResponse } from "forge-shared/dto/response/epicresponse.dto.js";

export function mapEpicResponse(epic: any): EpicResponse {
	return {
		eid: encryptPK("epic", epic.dataValues.id),
		code: epic.dataValues.code,
		title: epic.dataValues.title,
		description: epic.dataValues.description,
		createdAt: epic.dataValues.createdAt,
	};
}
