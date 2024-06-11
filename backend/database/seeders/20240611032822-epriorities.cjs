"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("epriorities", [
			{
				id: 1,
				title: "Low",
				description: "Low priority",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 2,
				title: "Medium",
				description: "Medium priority",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 3,
				title: "High",
				description: "High priority",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("epriorities", { id: { [Sequelize.Op.in]: [1, 2, 3] } }, {});
	},
};
