import { Priority } from "../../enum/priority.enum";
import { TaskStatus } from "../../enum/taskstatus.enum";
import { TaskType } from "../../enum/tasktype.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskSelfComposite:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         userstoryEid:
 *           type: string
 *         responsibleEid:
 *           type: string
 *           nullable: true
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           $ref: '#/components/schemas/TaskStatus'
 *         type:
 *           $ref: '#/components/schemas/TaskType'
 *         priority:
 *           $ref: '#/components/schemas/Priority'
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export interface TaskSelfComposite {
	eid: string;
	userstoryEid: string;
	responsibleEid?: string;
	code: string;
	title: string;
	description: string;
	status: TaskStatus;
	type: TaskType;
	priority: Priority;
	createdAt: string;
}
