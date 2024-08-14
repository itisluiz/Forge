import { DataTypes, Sequelize } from "sequelize";

export function define(modelName: string, sequelize: Sequelize) {
	sequelize.define(modelName, {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING(128),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.CHAR(64),
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
		surname: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
	});
}

export function associate(modelName: string, sequelize: Sequelize) {
	const models = sequelize.models;
	const thisModel = models[modelName];

	thisModel.belongsToMany(models["project"], { through: models["projectmembership"] });
	thisModel.hasMany(models["task"], { foreignKey: { allowNull: true, name: "assignedTo" } });
}
