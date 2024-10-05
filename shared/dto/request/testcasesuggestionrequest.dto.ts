/**
 * @swagger
 * components:
 *   schemas:
 *     TestcaseSuggestionRequest:
 *       type: object
 *       properties:
 *         acceptancecriteriaEid:
 *           type: string
 *         prompt:
 *           type: string
 *           nullable: true
 */
export interface TestcaseSuggestionRequest {
	acceptancecriteriaEid: string;
	prompt?: string;
}
