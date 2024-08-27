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
 *         gravatar:
 *           type: string
 *           format: uri
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface UserSelfResponse {
	eid: string;
	email: string;
	name: string;
	surname: string;
	gravatar: string;
	createdAt: string;
	updatedAt: string;
}
