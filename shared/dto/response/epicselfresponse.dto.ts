import { EpicSelfComposite } from "../composite/epicselfcomposite.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     EpicSelfResponse:
 *       type: object
 *       properties:
 *         epics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EpicSelfComposite'
 */
export interface EpicSelfResponse {
	epics: EpicSelfComposite[];
}
