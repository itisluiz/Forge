/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectUpdateMemberRequest:
 *       type: object
 *       properties:
 *         eid:
 *           type: string
 *         role:
 *           type: number
 *           nullable: true
 *         admin:
 *           type: boolean
 *           nullable: true
 */
export interface ProjectUpdateMemberRequest {
	eid: string;
	role?: number;
	admin?: boolean;
}
