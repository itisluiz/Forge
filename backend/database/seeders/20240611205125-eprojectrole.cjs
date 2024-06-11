"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("eprojectroles", [
			{
				id: 1,
				title: "Product Owner",
				description: "The person responsible for the product backlog and the product vision",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 2,
				title: "Scrum Master",
				description:
					"The person responsible for the Scrum process, making sure it is used correctly and maximising its benefits",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 3,
				title: "Developer",
				description:
					"A person responsible for delivering potentially shippable increments of product at the end of every sprint",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
			{
				id: 4,
				title: "Tester",
				description: "A person responsible for ensuring the quality of the product",
				createdAt: new Date(0),
				updatedAt: new Date(0),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("eprojectroles", { id: { [Sequelize.Op.in]: [1, 2, 3, 4] } }, {});
	},
};
