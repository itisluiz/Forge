/**
 * @swagger
 * components:
 *   schemas:
 *     FailureType:
 *       type: integer
 *       enum:
 *         - 0
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *       description: |
 *         Represents the error type:
 *         - 0: Other
 *         - 1: Internal
 *         - 2: Not Found
 *         - 3: Bad Request
 *         - 4: Unauthorized
 */
export const enum FailureType {
	OTHER,
	INTERNAL,
	NOTFOUND,
	BADREQUEST,
	UNAUTHORIZED,
}
