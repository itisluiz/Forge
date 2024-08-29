/**
 * @swagger
 * components:
 *   schemas:
 *     AcceptanceCriteriaNewRequest:
 *       type: object
 *       properties:
 *         userstoryEid:
 *           type: string
 *         given:
 *           type: string
 *         when:
 *           type: string
 *         then:
 *           type: string
 */
export interface AcceptanceCriteriaNewRequest {
	userstoryEid: string;
	given: string;
	when: string;
	then: string;
}
