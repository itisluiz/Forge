/**
 * @swagger
 * components:
 *   schemas:
 *     SprintPeriodStatus:
 *       type: integer
 *       enum:
 *         - 1
 *         - 2
 *         - 3
 *       description: |
 *         Represents the sprint period status:
 *         - 1: Past
 *         - 2: On going
 *         - 3: Future
 */
export const enum SprintPeriodStatus {
	PAST = 1,
	ONGOING,
	FUTURE,
}
