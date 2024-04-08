import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Get a test message
 *     description: Returns "Hello, World!" as a test message.
 *     responses:
 *       200:
 *         description: Successful response with the test message.
 */
router.get("/test", (req, res) => {
	res.send("Hello, World!");
});

export default router;
