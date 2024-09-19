import { SprintResponse } from "./sprintresponse.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     SprintMonadResponse:
 *       type: object
 *       properties:
 *         sprint:
 *           $ref: '#/components/schemas/SprintResponse'
 *           nullable: true
 */
export interface SprintMonadResponse {
	sprint: SprintResponse | null;
}
