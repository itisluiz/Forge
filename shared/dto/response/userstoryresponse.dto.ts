import { Priority } from "../../enum/priority.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserstoryResponse:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         epicEid:
 *           type: string
 *         sprintEid:
 *           type: string
 *           nullable: true
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         narrative:
 *           type: string
 *         premisse:
 *           type: string
 *         priority:
 *           $ref: '#/components/schemas/Priority'
 *         storyActor:
 *           type: string
 *         storyObjective:
 *           type: string
 *         storyJustification:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface UserstoryResponse {
	eid: string;
	epicEid: string;
	sprintEid?: string;
	title: string;
	description: string;
	narrative: string;
	premisse: string;
	priority: Priority;
	storyActor: string;
	storyObjective: string;
	storyJustification: string;
	createdAt: string;
	updatedAt: string;
}
