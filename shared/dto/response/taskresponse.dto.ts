import { Priority } from "../../enum/priority.enum";
import { TaskStatus } from "../../enum/taskstatus.enum";
import { TaskType } from "../../enum/tasktype.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskResponse:
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
 *         startedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         complexity:
 *           type: number
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface TaskResponse {
	eid: string;
	userstoryEid: string;
	responsibleEid?: string;
	code: string;
	title: string;
	description: string;
	status: TaskStatus;
	type: TaskType;
	priority: Priority;
	startedAt?: string;
	completedAt?: string;
	complexity?: number;
	createdAt: string;
	updatedAt: string;
}
