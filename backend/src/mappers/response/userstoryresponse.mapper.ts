import { encryptPK } from "../../util/encryption.js";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";

export function mapUserstoryResponse(userstory: any): UserstoryResponse {
	return {
		eid: encryptPK("userstory", userstory.dataValues.id),
		epicEid: encryptPK("epic", userstory.dataValues.epicId),
		sprintEid: encryptPK("sprint", userstory.dataValues.sprintId),
		title: userstory.dataValues.title,
		description: userstory.dataValues.description,
		narrative: userstory.dataValues.narrative,
		premisse: userstory.dataValues.premisse,
		priority: userstory.dataValues.epriorityId,
		storyActor: userstory.dataValues.storyActor,
		storyObjective: userstory.dataValues.storyObjective,
		storyJustification: userstory.dataValues.storyJustification,
		createdAt: userstory.dataValues.createdAt,
		updatedAt: userstory.dataValues.updatedAt,
	};
}
