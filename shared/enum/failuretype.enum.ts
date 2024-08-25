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
 *         - 6
 *       description: |
 *         Represents the failure type:
 *         - 1: Other
 *         - 2: Internal
 *         - 3: Not Found
 *         - 4: Bad Request
 *         - 5: Unauthorized
 *         - 6: Forbidden
 */
export const enum FailureType {
	OTHER = 1,
	INTERNAL,
	NOTFOUND,
	BADREQUEST,
	UNAUTHORIZED,
	FORBIDDEN,
}
