import { DataTypes, Sequelize } from "sequelize";

export function define(modelName: string, sequelize: Sequelize) {
	sequelize.define(modelName, {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		code: {
			type: DataTypes.CHAR(3),
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.belongsToMany(models["user"], { through: models["projectmembership"], onDelete: "CASCADE" });
	thisModel.hasMany(models["projectinvitation"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
	thisModel.hasMany(models["projectmembership"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
	thisModel.hasMany(models["epic"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
	thisModel.hasMany(models["sprint"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
}
