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
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           $ref: '#/components/schemas/TaskStatus'
 *         type:
 *           $ref: '#/components/schemas/TaskType'
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
	title: string;
	description: string;
	status: TaskStatus;
	type: TaskType;
	createdAt: string;
	updatedAt: string;
}
