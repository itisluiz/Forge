/**
 * @swagger
 * components:
 *   schemas:
 *     TaskType:
 *       type: integer
 *       enum:
 *         - 1
 *         - 2
 *       description: |
 *         Represents the task type:
 *         - 1: To-do
 *         - 2: In Progress
 */
export const enum TaskType {
	TASK = 1,
	BUG,
}
