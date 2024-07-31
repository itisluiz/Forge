/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignupRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *         surname:
 *           type: string
 */
export interface UserSignupRequest {
	email: string;
	password: string;
	name: string;
	surname: string;
}
