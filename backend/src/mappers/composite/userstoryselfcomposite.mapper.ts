import { encryptPK } from "../../util/encryption.js";
import { UserstorySelfComposite } from "forge-shared/dto/composite/userstoryselfcomposite.dto";

export function mapUserstorySelfComposite(userstory: any, projectCode: string): UserstorySelfComposite {
	return {
		eid: encryptPK("userstory", userstory.dataValues.id),
		epicEid: encryptPK("epic", userstory.dataValues.epicId),
		sprintEid: encryptPK("sprint", userstory.dataValues.sprintId),
		code: `${projectCode}-PBI-${userstory.dataValues.index}`,
		title: userstory.dataValues.title,
		description: userstory.dataValues.description,
		priority: userstory.dataValues.epriorityId,
	};
}
