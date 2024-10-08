import { DataTypes, Sequelize } from "sequelize";

export function define(modelName: string, sequelize: Sequelize) {
	sequelize.define(modelName, {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		index: {
			type: DataTypes.INTEGER.UNSIGNED,
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
		narrative: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		premisse: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		storyActor: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		storyObjective: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		storyJustification: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		effortScore: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.belongsTo(models["epic"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
	thisModel.belongsTo(models["epriority"], { foreignKey: { allowNull: false } });
	thisModel.belongsTo(models["sprint"], { foreignKey: { allowNull: true } });
	thisModel.hasMany(models["acceptancecriteria"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
	thisModel.hasMany(models["task"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
}
