/**
 * @swagger
 * components:
 *   schemas:
 *     PlanningpokerParticipantComposite:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         surname:
 *           type: string
 *         gravatar:
 *           type: string
 *           format: uri
 *         vote:
 *           type: number
 *           nullable: true
 */
export interface PlanningpokerParticipantComposite {
	eid: string;
	email: string;
	name: string;
	surname: string;
	gravatar: string;
	vote?: null | number;
}
