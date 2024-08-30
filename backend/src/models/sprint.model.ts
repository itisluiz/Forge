import { SprintPeriodStatus } from "forge-shared/enum/sprintperiodstatus.enum";
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

	thisModel.belongsTo(models["esprintstatus"], { foreignKey: { allowNull: false } });
	thisModel.belongsTo(models["project"], { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
	thisModel.hasMany(models["userstory"], { foreignKey: { allowNull: true }, onDelete: "SET NULL" });
}

export function validInterval(this: any) {
	return this.dataValues.startsAt < this.dataValues.endsAt;
}

export function getPeriodStatus(this: any) {
	const now = new Date();

	if (this.dataValues.startsAt > now) {
		return SprintPeriodStatus.FUTURE;
	}

	if (this.dataValues.endsAt < now) {
		return SprintPeriodStatus.PAST;
	}

	return SprintPeriodStatus.ONGOING;
}
