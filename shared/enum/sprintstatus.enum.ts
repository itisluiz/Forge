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
 *         Represents the sprint status:
 *         - 1: Plan
 *         - 2: Design
 *         - 3: Develop
 *         - 4: Test
 *         - 5: Deploy
 *         - 6: Review
 *         - 7: Launch
 */
export const enum SprintStatus {
	PLAN = 1,
	DESIGN,
	DEVELOP,
	TEST,
	DEPLOY,
	REVIEW,
	LAUNCH,
}
