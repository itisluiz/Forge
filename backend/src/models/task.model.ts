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
		startedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		completedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.belongsTo(models["etaskstatus"], { foreignKey: { allowNull: false } });
	thisModel.belongsTo(models["etasktype"], { foreignKey: { allowNull: false } });
	thisModel.belongsTo(models["epriority"], { foreignKey: { allowNull: false } });
	thisModel.belongsTo(models["user"], { foreignKey: { allowNull: true, name: "assignedTo" }, onDelete: "SET NULL" });
	thisModel.belongsTo(models["userstory"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
}
