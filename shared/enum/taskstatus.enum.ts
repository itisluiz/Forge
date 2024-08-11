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
 *       description: |
 *         Represents the task status:
 *         - 1: To-do
 *         - 2: In Progress
 *         - 3: Done
 *         - 4: Cancelled
 */
export const enum TaskStatus {
	TODO = 1,
	INPROGRESS,
	DONE,
	CANCELLED,
}
