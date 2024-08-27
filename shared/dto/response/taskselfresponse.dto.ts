import { TaskSelfComposite } from "../composite/taskselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskSelfResponse:
 *       type: object
 *       properties:
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskSelfComposite'
 */
export interface TaskSelfResponse {
	tasks: TaskSelfComposite[];
}
