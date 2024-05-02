import { Priority } from "../enum/priority.enum";

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
 *         priority:
 *           $ref: '#/components/schemas/Priority'
 */
export interface Person {
	name: string;
	age: number;
	priority: Priority;
}
