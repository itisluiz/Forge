import { TaskStatus } from "../../enum/taskstatus.enum";
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
 *         status:
 *           $ref: '#/components/schemas/TaskStatus'
 *         type:
 *           $ref: '#/components/schemas/TaskType'
 */
export interface TaskNewRequest {
	userstoryEid: string;
	responsibleEid?: string;
	title: string;
	description: string;
	status: TaskStatus;
	type: TaskType;
}
