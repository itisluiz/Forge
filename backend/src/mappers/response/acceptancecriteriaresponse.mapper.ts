import { AcceptanceCriteriaResponse } from "forge-shared/dto/response/acceptancecriteriaresponse.dto";
import { encryptPK } from "../../util/encryption.js";

export function mapAcceptanceCriteriaResponse(acceptancecriteria: any): AcceptanceCriteriaResponse {
	return {
		eid: encryptPK("acceptancecriteria", acceptancecriteria.dataValues.id),
		userstoryEid: encryptPK("userstory", acceptancecriteria.dataValues.userstoryId),
		given: acceptancecriteria.dataValues.criteriaGiven,
		when: acceptancecriteria.dataValues.criteriaWhen,
		then: acceptancecriteria.dataValues.criteriaThen,
		createdAt: acceptancecriteria.dataValues.createdAt,
		updatedAt: acceptancecriteria.dataValues.updatedAt,
	};
}
