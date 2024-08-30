/**
 * @swagger
 * components:
 *   schemas:
 *     AcceptanceCriteriaSelfComposite:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         index:
 *           type: number
 *         given:
 *           type: string
 *         when:
 *           type: string
 *         then:
 *           type: string
 */
export interface AcceptanceCriteriaSelfComposite {
	eid: string;
	index: number;
	given: string;
	when: string;
	then: string;
}
