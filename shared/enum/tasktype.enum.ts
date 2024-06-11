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
 *         - 1: Task
 *         - 2: Bug
 */
export const enum TaskType {
	TASK = 1,
	BUG = 2,
}
