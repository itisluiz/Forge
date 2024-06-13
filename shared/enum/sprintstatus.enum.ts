/**
 * @swagger
 * components:
 *   schemas:
 *     SprintStatus:
 *       type: integer
 *       enum:
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *         - 5
 *         - 6
 *         - 7
 *       description: |
 *         Represents the task status:
 *         - 1: Plan
 *         - 2: Design
 *         - 3: Develop
 *         - 4: Test
 *         - 5: Deploy
 *         - 6: Review
 *         - 7: Launch
 */
export const enum TaskStatus {
	PLAN = 1,
	DESIGN = 2,
	DEVELOP = 3,
	TEST = 4,
	DEPLOY = 5,
	REVIEW = 6,
	LAUNCH = 7,
}
