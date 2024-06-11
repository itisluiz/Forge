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
 *         Represents the task type:
 *         - 1: Product Owner
 *         - 2: Scrum Master
 *         - 3: Developer
 *         - 4: Tester
 */
export const enum ProjectRole {
	PRODUCTOWNER = 1,
	SCRUMMASTER = 2,
	DEVELOPER = 3,
	TESTER = 4,
}
