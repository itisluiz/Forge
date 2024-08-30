import { Priority } from "../../enum/priority.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserstorySelfComposite:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         epicEid:
 *           type: string
 *         sprintEid:
 *           type: string
 *           nullable: true
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         priority:
 *           $ref: '#/components/schemas/Priority'
 */
export interface UserstorySelfComposite {
	eid: string;
	epicEid: string;
	sprintEid?: string;
	code: string;
	title: string;
	description: string;
	priority: Priority;
}
