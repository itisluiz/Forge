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
 *         - 4: Canceled
 */
export const enum TaskStatus {
	TODO = 1,
	INPROGRESS = 2,
	DONE = 3,
	CANCELED = 4,
}
