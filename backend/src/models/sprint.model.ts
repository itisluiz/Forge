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

export function calculateBurndownForDate(this: any, date: Date) {
	const tasks = this.dataValues.userstories.flatMap((userstory: any) => userstory.dataValues.tasks);

	if (date < this.dataValues.startsAt || date > this.dataValues.endsAt) {
		return null;
	}

	const effort = tasks.reduce((totalEffort: number, task: any) => {
		if (task.dataValues.createdAt < date && (!task.dataValues.completedAt || task.dataValues.completedAt > date)) {
			return totalEffort + task.dataValues.complexity;
		}
		return totalEffort;
	}, 0) as number;

	return effort;
}

export function capDate(this: any, date: Date) {
	if (!date) {
		return null;
	}

	if (date < this.dataValues.startsAt) {
		return this.dataValues.startsAt;
	}

	if (date > this.dataValues.endsAt) {
		return this.dataValues.endsAt;
	}

	return date;
}
