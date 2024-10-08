"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("etaskstatuses", [
			{
				id: 1,
				title: "To-do",
				description: "A task that has yet to start being worked on",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 2,
				title: "In Progress",
				description: "A task that is currently being worked on",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 3,
				title: "Available to Review",
				description: "A task that is ready to be reviewed by the team",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 4,
				title: "Reviewed",
				description: "A task that has passed the reviewing by the team",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 5,
				title: "Done",
				description: "A task that has been completed successfully",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 6,
				title: "Cancelled",
				description: "A task that has been cancelled",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("etaskstatuses", {
			id: [1, 2, 3, 4, 5, 6],
		});
	},
};
