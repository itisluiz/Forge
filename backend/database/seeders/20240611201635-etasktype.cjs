"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("etasktypes", [
			{
				id: 1,
				title: "Task",
				description: "An endeavour for implmemententing new functionality",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 2,
				title: "Bug",
				description: "An endeavour towards fixing existing functionality",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("etasktypes", { id: { [Sequelize.Op.in]: [1, 2] } }, {});
	},
};
