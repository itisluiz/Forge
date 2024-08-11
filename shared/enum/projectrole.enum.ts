/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectRole:
 *       type: integer
 *       enum:
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *       description: |
 *         Represents the project role:
 *         - 1: Product Owner
 *         - 2: Scrum Master
 *         - 3: Developer
 *         - 4: Tester
 */
export const enum ProjectRole {
	PRODUCT_OWNER = 1,
	SCRUM_MASTER,
	DEVELOPER,
	TESTER,
}
