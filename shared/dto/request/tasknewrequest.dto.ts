import { Priority } from "../../enum/priority.enum";
import { TaskType } from "../../enum/tasktype.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskNewRequest:
 *       type: object
 *       properties:
 *         userstoryEid:
 *           type: string
 *         responsibleEid:
 *           type: string
 *           nullable: true
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           $ref: '#/components/schemas/TaskType'
 *         priority:
 *           $ref: '#/components/schemas/Priority'
 */
export interface TaskNewRequest {
	userstoryEid: string;
	responsibleEid?: string;
	title: string;
	description: string;
	type: TaskType;
	priority: Priority;
}
