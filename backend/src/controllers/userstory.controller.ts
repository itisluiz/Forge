import { authorize } from "../middleware/auth.middleware.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { Router } from "express";
import { userstoryNewRequestJsonSchema } from "../jsonschemas/userstorynewrequest.jsonschema.js";

const router = Router();

/**
 * @swagger
 * /api/userstory/{projectEid}/new:
 *   post:
 *     summary: Create a new user story.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - userstory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserstoryNewRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserstoryResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	"/api/userstory/:projectEid/new",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(userstoryNewRequestJsonSchema),
	async (req, res) => {
		await handle("userstory", "new", req, res);
	},
);

export default router;
