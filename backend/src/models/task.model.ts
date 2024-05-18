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
		description: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.belongsTo(models["etaskstatus"], { foreignKey: { allowNull: false } });
	thisModel.belongsTo(models["etasktype"], { foreignKey: { allowNull: false } });
	thisModel.belongsTo(models["user"], { foreignKey: { allowNull: true, name: "assignedTo" } });
	thisModel.belongsTo(models["userstory"], { foreignKey: { allowNull: false } });
}
