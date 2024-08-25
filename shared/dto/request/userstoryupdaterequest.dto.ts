import { Priority } from "../../enum/priority.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserstoryUpdateRequest:
 *       type: object
 *       properties:
 *         sprintEid:
 *           type: string
 *           nullable: true
 *         title:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         storyActor:
 *           type: string
 *           nullable: true
 *         storyObjective:
 *           type: string
 *           nullable: true
 *         storyJustification:
 *           type: string
 *           nullable: true
 *         priority:
 *           $ref: '#/components/schemas/Priority'
 *           nullable: true
 */
export interface UserstoryUpdateRequest {
	sprintEid?: string;
	title?: string;
	description?: string;
	storyActor?: string;
	storyObjective?: string;
	storyJustification?: string;
	priority?: Priority;
}
