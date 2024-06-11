/**
 * @swagger
 * components:
 *   schemas:
 *     FailureType:
 *       type: integer
 *       enum:
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *         - 5
 *       description: |
 *         Represents the error type:
 *         - 1: Other
 *         - 2: Internal
 *         - 3: Not Found
 *         - 4: Bad Request
 *         - 5: Unauthorized
 */
export const enum FailureType {
	OTHER = 1,
	INTERNAL = 2,
	NOTFOUND = 3,
	BADREQUEST = 4,
	UNAUTHORIZED = 5,
}
