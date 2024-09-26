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
 *         narrative:
 *           type: string
 *           nullable: true
 *         premisse:
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
	sprintEid?: string | null;
	title?: string;
	description?: string;
	narrative?: string;
	premisse?: string;
	storyActor?: string;
	storyObjective?: string;
	storyJustification?: string;
	priority?: Priority;
}
