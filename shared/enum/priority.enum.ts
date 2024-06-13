/**
 * @swagger
 * components:
 *   schemas:
 *     Priority:
 *       type: integer
 *       enum:
 *         - 1
 *         - 2
 *         - 3
 *       description: |
 *         Represents the priority level:
 *         - 1: Low
 *         - 2: Medium
 *         - 3: High
 */
export const enum Priority {
	LOW = 1,
	MEDIUM = 2,
	HIGH = 3,
}
