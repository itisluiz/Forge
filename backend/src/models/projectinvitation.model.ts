import { DataTypes, Sequelize } from "sequelize";

export function define(modelName: string, sequelize: Sequelize) {
	sequelize.define(modelName, {
		code: {
			type: DataTypes.CHAR(24),
			primaryKey: true,
		},
		durationHours: {
			type: DataTypes.FLOAT,
			defaultValue: 24,
		},
		remainingUses: {
			type: DataTypes.INTEGER.UNSIGNED,
			defaultValue: 1,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.belongsTo(models["project"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
	thisModel.belongsTo(models["eprojectrole"], { foreignKey: { allowNull: false } });
}

export function expirationDate(this: any) {
	return new Date(this.dataValues.createdAt.getTime() + this.dataValues.durationHours * 60 * 60 * 1000);
}

export function isExpired(this: any) {
	return this.expirationDate() < new Date();
}
