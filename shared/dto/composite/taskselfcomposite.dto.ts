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
 *         status:
 *           $ref: '#/components/schemas/TaskStatus'
 *         type:
 *           $ref: '#/components/schemas/TaskType'
 */
export interface TaskSelfComposite {
	eid: string;
	userstoryEid: string;
	responsibleEid?: string;
	code: string;
	title: string;
	status: TaskStatus;
	type: TaskType;
}
