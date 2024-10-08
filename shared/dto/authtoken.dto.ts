/**
 * @swagger
 * components:
 *   schemas:
 *     AuthToken:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         iss:
 *           type: string
 *         sub:
 *           type: string
 *         iat:
 *           type: number
 *         exp:
 *           type: number
 */
export interface AuthToken {
	token: string;
	iss: string;
	sub: string;
	iat: number;
	exp: number;
}
