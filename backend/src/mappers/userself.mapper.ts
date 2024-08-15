import { Model } from "sequelize";
import { UserSelfResponse } from "forge-shared/dto/response/userselfresponse.dto";
import { encryptPK } from "../util/encryption.js";

export function mapUserSelf(user: Model<any, any>): UserSelfResponse {
	return {
		eid: encryptPK("user", user.dataValues.id),
		email: user.dataValues.email,
		name: user.dataValues.name,
		surname: user.dataValues.surname,
		createdAt: user.dataValues.createdAt,
	};
}
