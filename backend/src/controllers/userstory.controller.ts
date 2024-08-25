import { authorize } from "../middleware/auth.middleware.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { Router } from "express";
import { userstoryNewRequestJsonSchema } from "../jsonschemas/userstorynewrequest.jsonschema.js";
import { userstoryUpdateRequestJsonSchema } from "../jsonschemas/userstoryupdaterequest.jsonschema copy.js";

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

/**
 * @swagger
 * /api/userstory/{projectEid}/{userstoryEid}/update:
 *   patch:
 *     summary: Updates an existing user story.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: userstoryEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The user story's identifier.
 *     tags:
 *       - userstory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserstoryUpdateRequest'
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
router.patch(
	"/api/userstory/:projectEid/:userstoryEid/update",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(userstoryUpdateRequestJsonSchema),
	async (req, res) => {
		await handle("userstory", "update", req, res);
	},
);

/**
 * @swagger
 * /api/userstory/{projectEid}/{epicEid}/self:
 *   get:
 *     summary: Get all user stories for the given epic.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: epicEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The epic's identifier.
 *     tags:
 *       - userstory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserstorySelfResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/userstory/:projectEid/:epicEid/self", authorize(), authorizeProject(), async (req, res) => {
	await handle("userstory", "self", req, res);
});

/**
 * @swagger
 * /api/userstory/{projectEid}/{userstoryEid}/get:
 *   get:
 *     summary: Get an user story by its identifier.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: userstoryEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The user story's identifier.
 *     tags:
 *       - userstory
 *     security:
 *       - bearerAuth: []
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
router.get("/api/userstory/:projectEid/:userstoryEid/get", authorize(), authorizeProject(), async (req, res) => {
	await handle("userstory", "get", req, res);
});

/**
 * @swagger
 * /api/userstory/{projectEid}/{userstoryEid}/delete:
 *   delete:
 *     summary: Delete an user story by its identifier.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: userstoryEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The user story's identifier.
 *     tags:
 *       - userstory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.delete("/api/userstory/:projectEid/:userstoryEid/delete", authorize(), authorizeProject(), async (req, res) => {
	await handle("userstory", "delete", req, res);
});

export default router;
