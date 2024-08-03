/**
 * @swagger
 * components:
 *   schemas:
 *     AuthToken:
 *       type: object
 *       properties:
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
	iss: string;
	sub: string;
	iat: number;
	exp: number;
}
