import { DataTypes, Sequelize } from "sequelize";

export function define(modelName: string, sequelize: Sequelize) {
	sequelize.define(modelName, {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.belongsTo(models["acceptancecriteria"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
	thisModel.hasMany(models["testcasestep"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
}
