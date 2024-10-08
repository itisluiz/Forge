import { DataTypes, Sequelize } from "sequelize";

export function define(modelName: string, sequelize: Sequelize) {
	sequelize.define(modelName, {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		criteriaGiven: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		criteriaWhen: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		criteriaThen: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.belongsTo(models["userstory"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
	thisModel.hasMany(models["testcase"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
}
