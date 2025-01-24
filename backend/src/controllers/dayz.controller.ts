import { handle } from "../util/handle.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/dayz/time:
 *   get:
 *     summary: Get the current time in the server
 *     tags:
 *       - dayz
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DayZTimeResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/dayz/time", async (req, res) => {
	await handle("dayz", "time", req, res);
});

export default router;
