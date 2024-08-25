/**
 * @swagger
 * components:
 *   schemas:
 *     UserSelfResponse:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         surname:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export interface UserSelfResponse {
	eid: string;
	email: string;
	name: string;
	surname: string;
	createdAt: string;
}
