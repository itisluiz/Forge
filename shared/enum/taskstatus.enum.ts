/**
 * @swagger
 * components:
 *   schemas:
 *     TaskStatus:
 *       type: integer
 *       enum:
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *         - 5
 *         - 6
 *       description: |
 *         Represents the task status:
 *         - 1: To-do
 *         - 2: In Progress
 *         - 3: Available to Review
 *         - 4: Reviewing
 *         - 5: Done
 *         - 6: Cancelled
 */
export const enum TaskStatus {
	TODO = 1,
	INPROGRESS,
	AVAILABLETOREVIEW,
	REVIEWING,
	DONE,
	CANCELLED,
}
