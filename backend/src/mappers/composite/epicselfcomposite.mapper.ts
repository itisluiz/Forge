import { encryptPK } from "../../util/encryption.js";
import { EpicSelfComposite } from "forge-shared/dto/composite/epicselfcomposite.dto";

export function mapEpicSelfComposite(epic: any, projectCode: string): EpicSelfComposite {
	return {
		eid: encryptPK("epic", epic.dataValues.id),
		code: `${projectCode}-EPC-${epic.dataValues.index}`,
		title: epic.dataValues.title,
		description: epic.dataValues.description,
	};
}
