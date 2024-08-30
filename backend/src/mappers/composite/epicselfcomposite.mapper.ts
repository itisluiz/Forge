import { encryptPK } from "../../util/encryption.js";
import { EpicSelfComposite } from "forge-shared/dto/composite/epicselfcomposite.dto";

export function mapEpicSelfComposite(epic: any): EpicSelfComposite {
	return {
		eid: encryptPK("epic", epic.dataValues.id),
		code: "<code>",
		title: epic.dataValues.title,
		description: epic.dataValues.description,
	};
}
