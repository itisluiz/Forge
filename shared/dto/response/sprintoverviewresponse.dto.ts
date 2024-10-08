/**
 * @swagger
 * components:
 *   schemas:
 *     SprintOverviewResponse:
 *       type: object
 *       properties:
 *         sprintOverview:
 *           type: string
 *         generatedAt:
 *           type: string
 *           format: date-time
 */
export interface SprintOverviewResponse {
	sprintOverview: string;
	generatedAt: string;
}
