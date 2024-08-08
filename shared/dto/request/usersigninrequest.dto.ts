/**
 * @swagger
 * components:
 *   schemas:
 *     UserSigninRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 */
export interface UserSigninRequest {
	email: string;
	password: string;
}
