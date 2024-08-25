import { encryptPK } from "../../util/encryption.js";
import { UserSelfResponse } from "forge-shared/dto/response/userselfresponse.dto";

export function mapUserSelfResponse(user: any): UserSelfResponse {
	return {
		eid: encryptPK("user", user.dataValues.id),
		email: user.dataValues.email,
		name: user.dataValues.name,
		surname: user.dataValues.surname,
		createdAt: user.dataValues.createdAt,
	};
}
