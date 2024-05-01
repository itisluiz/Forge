/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: number
 */
export default interface Person {
	name: string;
	age: number;
}
