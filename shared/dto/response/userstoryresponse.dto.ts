/**
 * @swagger
 * components:
 *   schemas:
 *     UserstoryResponse:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         epicEid:
 *           type: string
 *         sprintEid:
 *           type: string
 *           nullable: true
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         storyActor:
 *           type: string
 *         storyObjective:
 *           type: string
 *         storyJustification:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export interface UserstoryResponse {
	eid: string;
	epicEid: string;
	sprintEid?: string;
	title: string;
	description: string;
	storyActor: string;
	storyObjective: string;
	storyJustification: string;
	createdAt: string;
}
