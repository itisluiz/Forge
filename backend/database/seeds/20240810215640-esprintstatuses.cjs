"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("esprintstatuses", [
			{
				id: 1,
				title: "Plan",
				description: "The sprint planning phase, where the team decides what work to complete in the upcoming sprint",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 2,
				title: "Design",
				description: "The sprint design phase, where the team decides how to complete the planned work",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 3,
				title: "Develop",
				description: "The sprint development phase, where the team completes the planned work",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 4,
				title: "Test",
				description: "The sprint testing phase, where the team ensures the quality of the completed work",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 5,
				title: "Deploy",
				description: "The sprint deployment phase, where the team releases the completed work to the users",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 6,
				title: "Review",
				description:
					"The sprint review phase, where the team reflects on the completed work and identifies areas for improvement",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 7,
				title: "Launch",
				description:
					"The sprint launch phase, where the team celebrates the completion of the sprint and prepares for the next one",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("esprintstatuses", {
			id: [1, 2, 3, 4, 5, 6, 7],
		});
	},
};
