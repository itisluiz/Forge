/**
 * @swagger
 * components:
 *   schemas:
 *     AcceptanceCriteriaResponse:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         userstoryEid:
 *           type: string
 *         given:
 *           type: string
 *         when:
 *           type: string
 *         then:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface AcceptanceCriteriaResponse {
	eid: string;
	userstoryEid: string;
	given: string;
	when: string;
	then: string;
	createdAt: string;
	updatedAt: string;
}
