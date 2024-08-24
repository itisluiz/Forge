import { encryptPK } from "../../util/encryption.js";
import { EpicSelfComposite } from "forge-shared/dto/composite/epicselfcomposite.dto";

export function mapEpicSelfComposite(epic: any): EpicSelfComposite {
	return {
		eid: encryptPK("epic", epic.dataValues.id),
		code: epic.dataValues.code,
		title: epic.dataValues.name,
	};
}
