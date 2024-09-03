/**
 * @swagger
 * components:
 *   schemas:
 *     AcceptanceCriteriaUpdateRequest:
 *       type: object
 *       properties:
 *         given:
 *           type: string
 *           nullable: true
 *         when:
 *           type: string
 *           nullable: true
 *         then:
 *           type: string
 *           nullable: true
 */
export interface AcceptanceCriteriaUpdateRequest {
	given?: string;
	when?: string;
	then?: string;
}
