import { TaskStatus } from "../../enum/taskstatus.enum";
import { TaskType } from "../../enum/tasktype.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskUpdateRequest:
 *       type: object
 *       properties:
 *         responsibleEid:
 *           type: string
 *           nullable: true
 *         title:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/TaskStatus'
 *           nullable: true
 *         type:
 *           $ref: '#/components/schemas/TaskType'
 *           nullable: true
 */
export interface TaskUpdateRequest {
	responsibleEid?: string;
	title?: string;
	description?: string;
	status?: TaskStatus;
	type?: TaskType;
}
