/**
 * @swagger
 * components:
 *   schemas:
 *     AcceptanceCriteriaSelfComposite:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         given:
 *           type: string
 *         when:
 *           type: string
 *         then:
 *           type: string
 */
export interface AcceptanceCriteriaSelfComposite {
	eid: string;
	given: string;
	when: string;
	then: string;
}
