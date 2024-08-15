import { DataTypes, Sequelize } from "sequelize";

export function define(modelName: string, sequelize: Sequelize) {
	sequelize.define(modelName, {
		isAdmin: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.belongsTo(models["eprojectrole"], { foreignKey: { allowNull: false } });
	thisModel.belongsTo(models["user"], { foreignKey: { allowNull: false } });
	thisModel.belongsTo(models["project"], { foreignKey: { allowNull: false } });
}
