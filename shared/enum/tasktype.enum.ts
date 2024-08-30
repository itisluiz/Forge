/**
 * @swagger
 * components:
 *   schemas:
 *     TaskType:
 *       type: integer
 *       enum:
 *         - 1
 *         - 2
 *         - 3
 *       description: |
 *         Represents the task type:
 *         - 1: Task
 *         - 2: Bug
 *         - 3: Test
 */
export const enum TaskType {
	TASK = 1,
	BUG,
	TEST,
}
