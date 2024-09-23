import { Priority } from "../../enum/priority.enum";
import { TaskSelfComposite } from "../composite/taskselfcomposite.dto";

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
 *         code:
 *           type: string
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
 *         effortScore:
 *           type: number
 *           nullable: true
 *         freeEffortScore:
 *           type: number
 *           nullable: true
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskSelfComposite'
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
	code: string;
	title: string;
	description: string;
	narrative: string;
	premisse: string;
	priority: Priority;
	storyActor: string;
	storyObjective: string;
	storyJustification: string;
	effortScore?: number;
	freeEffortScore?: number;
	tasks: TaskSelfComposite[];
	createdAt: string;
	updatedAt: string;
}
