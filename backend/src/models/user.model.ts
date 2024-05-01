import { DataTypes, Sequelize } from "sequelize";

export function define(modelName: string, sequelize: Sequelize) {
	return sequelize.define(modelName, {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING(128),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.CHAR(64),
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
	});
}

export function associate(sequelize: Sequelize) {
	const models = sequelize.models;
	// No associations
}
