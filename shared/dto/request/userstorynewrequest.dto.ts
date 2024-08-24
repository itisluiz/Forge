import { Priority } from "../../enum/priority.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserstoryNewRequest:
 *       type: object
 *       properties:
 *         epicEid:
 *           type: string
 *         sprintEid:
 *           type: string
 *           nullable: true
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         storyActor:
 *           type: string
 *         storyObjective:
 *           type: string
 *         storyJustification:
 *           type: string
 *         priority:
 *           $ref: '#/components/schemas/Priority'
 */
export interface UserstoryNewRequest {
	epicEid: string;
	sprintEid?: string;
	title: string;
	description: string;
	storyActor: string;
	storyObjective: string;
	storyJustification: string;
	priority: Priority;
}
