import { DataTypes, Sequelize } from "sequelize";

export function define(modelName: string, sequelize: Sequelize) {
	sequelize.define(modelName, {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		startsAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		endsAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.belongsTo(models["project"], { foreignKey: { allowNull: false } });
	thisModel.belongsTo(models["esprintstatus"], { foreignKey: { allowNull: false } });
}
