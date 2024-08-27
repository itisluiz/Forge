import { encryptPK } from "../../util/encryption.js";
import { SprintResponse } from "forge-shared/dto/response/sprintresponse.dto";

export function mapSprintResponse(userstory: any): SprintResponse {
	return {
		eid: encryptPK("sprint", userstory.dataValues.id),
		startsAt: userstory.dataValues.startsAt,
		endsAt: userstory.dataValues.endsAt,
		status: userstory.dataValues.esprintstatusId,
		createdAt: userstory.dataValues.createdAt,
		updatedAt: userstory.dataValues.updatedAt,
	};
}
