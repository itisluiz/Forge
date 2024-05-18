import { DataTypes, Sequelize } from "sequelize";

export function define(modelName: string, sequelize: Sequelize) {
	sequelize.define(modelName, {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING(32),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.hasMany(models["projectmembership"], { foreignKey: { allowNull: false } });
}
