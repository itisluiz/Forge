import { AcceptanceCriteriaSelfComposite } from "../composite/acceptancecriteriaselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     AcceptanceCriteriaSelfResponse:
 *       type: object
 *       properties:
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AcceptanceCriteriaSelfComposite'
 */
export interface AcceptanceCriteriaSelfResponse {
	acceptanceCriteria: AcceptanceCriteriaSelfComposite[];
}
