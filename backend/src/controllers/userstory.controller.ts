import { handle } from "../util/handle.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/userstory:
 *   post:
 *     summary: Sets the user story.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUserStory'
 */
router.post("/api/userstory", async (req, res) => {
	handle("userstory", "setuserstory", req, res);
});

/**
 * @swagger
 * /api/addtestcase:
 *   post:
 *     summary: Adds a test case.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTestCase'
 */
router.post("/api/addtestcase", async (req, res) => {
	handle("userstory", "addtestcase", req, res);
});

/**
 * @swagger
 * /api/aitestcase:
 *   get:
 *     summary: Gets the AI test case.
 *     responses:
 *       200:
 *         description: The AI test case.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AITestCase'
 */
router.get("/api/aitestcase", async (req, res) => {
	handle("userstory", "aitestcase", req, res);
});

/**
 * @swagger
 * /api/userstory:
 *   get:
 *     summary: Gets the user story.
 *     responses:
 *       200:
 *         description: The user story.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStory'
 */
router.get("/api/userstory", async (req, res) => {
	handle("userstory", "getuserstory", req, res);
});

export default router;
