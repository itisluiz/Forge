import { encryptPK } from "../../util/encryption.js";
import { getGravatarUrl } from "../../util/gravatar.js";
import { UserSelfResponse } from "forge-shared/dto/response/userselfresponse.dto";

export function mapUserSelfResponse(user: any): UserSelfResponse {
	return {
		eid: encryptPK("user", user.dataValues.id),
		email: user.dataValues.email,
		name: user.dataValues.name,
		surname: user.dataValues.surname,
		gravatar: getGravatarUrl(user.dataValues.email),
		createdAt: user.dataValues.createdAt,
		updatedAt: user.dataValues.updatedAt,
	};
}
