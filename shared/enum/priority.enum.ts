/**
 * @swagger
 * components:
 *   schemas:
 *     Priority:
 *       type: integer
 *       enum:
 *         - 0
 *         - 1
 *         - 2
 *       description: |
 *         Represents the priority level:
 *         - 0: Low
 *         - 1: Medium
 *         - 2: High
 */
export const enum Priority {
	LOW,
	MEDIUM,
	HIGH,
}
