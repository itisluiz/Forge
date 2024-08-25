import { FailureType } from "../../enum/failuretype.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     FailureResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         failureType:
 *           $ref: '#/components/schemas/FailureType'
 */
export interface FailureResponse {
	message: string;
	failureType: FailureType;
}
