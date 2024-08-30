import { AcceptanceCriteriaSelfComposite } from "forge-shared/dto/composite/acceptancecriteriaselfcomposite.dto";
import { encryptPK } from "../../util/encryption.js";

export function mapAcceptanceCriteriaSelfComposite(acceptancecriteria: any, index: number): AcceptanceCriteriaSelfComposite {
	return {
		eid: encryptPK("acceptancecriteria", acceptancecriteria.dataValues.id),
		index: index + 1,
		given: acceptancecriteria.dataValues.criteriaGiven,
		when: acceptancecriteria.dataValues.criteriaWhen,
		then: acceptancecriteria.dataValues.criteriaThen,
	};
}
