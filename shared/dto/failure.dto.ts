import { FailureType } from "../enum/failuretype.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     Failure:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         type:
 *           $ref: '#/components/schemas/FailureType'
 */
export interface Failure {
	message: string;
	failuretype: FailureType;
}
