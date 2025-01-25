/**
 * @swagger
 * components:
 *   schemas:
 *     DayZTimeResponse:
 *       type: object
 *       properties:
 *         time:
 *           type: string
 *         players:
 *           type: number
 *         maxPlayers:
 *           type: number
 */
export interface DayZTimeResponse {
	time: string;
	players: number;
	maxPlayers: number;
}
