import { encryptPK } from "../../util/encryption.js";
import { mapTaskSelfComposite } from "../composite/taskselfcomposite.mapper.js";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";

export function mapUserstoryResponse(userstory: any, projectCode: string): UserstoryResponse {
	return {
		eid: encryptPK("userstory", userstory.dataValues.id),
		epicEid: encryptPK("epic", userstory.dataValues.epicId),
		sprintEid: encryptPK("sprint", userstory.dataValues.sprintId),
		code: `${projectCode}-PBI-${userstory.dataValues.index}`,
		title: userstory.dataValues.title,
		description: userstory.dataValues.description,
		narrative: userstory.dataValues.narrative,
		premisse: userstory.dataValues.premisse,
		priority: userstory.dataValues.epriorityId,
		storyActor: userstory.dataValues.storyActor,
		storyObjective: userstory.dataValues.storyObjective,
		storyJustification: userstory.dataValues.storyJustification,
		tasks: userstory.dataValues.tasks.map((task: any) => mapTaskSelfComposite(task, projectCode)),
		createdAt: userstory.dataValues.createdAt,
		updatedAt: userstory.dataValues.updatedAt,
	};
}
