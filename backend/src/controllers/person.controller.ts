import { handle } from "../util/handle.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/person:
 *   get:
 *     summary: Get a sample person object.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 */
router.get("/api/person", async (req, res) => {
	await handle("person", "sample", res);
});

export default router;
