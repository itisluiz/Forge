import { authorize } from "../middleware/auth.middleware.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { epicNewRequestJsonSchema } from "../jsonschemas/epicnewrequest.jsonschema.js";
import { epicUpdateRequestJsonSchema } from "../jsonschemas/epicupdaterequest.jsonschema.js";
import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/epic/{projectEid}/new:
 *   post:
 *     summary: Create a new epic.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: Epic's project identifier.
 *     tags:
 *       - epic
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EpicNewRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EpicResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	"/api/epic/:projectEid/new",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(epicNewRequestJsonSchema),
	async (req, res) => {
		await handle("epic", "new", req, res);
	},
);

/**
 * @swagger
 * /api/epic/{projectEid}/self:
 *   get:
 *     summary: Get all Epics for the given project.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: Epic's project identifier.
 *     tags:
 *       - epic
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EpicSelfResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/epic/:projectEid/self", authorize(), authorizeProject(), async (req, res) => {
	await handle("epic", "self", req, res);
});

/**
 * @swagger
 * /api/epic/{projectEid}/{epicEid}/get:
 *   get:
 *     summary: Get information about a specific epic in a project.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: Epic's project identifier.
 *       - in: path
 *         name: epicEid
 *         schema:
 *           type: string
 *         required: true
 *         description: Epic's identifier.
 *     tags:
 *       - epic
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EpicResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/epic/:projectEid/:epicEid/get", authorize(), authorizeProject(), async (req, res) => {
	await handle("epic", "get", req, res);
});

/**
 * @swagger
 * /api/epic/{projectEid}/{epicEid}/update:
 *   patch:
 *     summary: Update an existing epic.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: Epic's project identifier.
 *       - in: path
 *         name: epicEid
 *         schema:
 *           type: string
 *         required: true
 *         description: Epic's identifier.
 *     tags:
 *       - epic
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EpicUpdateRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EpicResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.patch(
	"/api/epic/:projectEid/:epicEid/update",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(epicUpdateRequestJsonSchema),
	async (req, res) => {
		await handle("epic", "update", req, res);
	},
);

/**
 * @swagger
 * /api/epic/{projectEid}/{epicEid}/delete:
 *   delete:
 *     summary: Delete an existing epic.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: Epic's project identifier.
 *       - in: path
 *         name: epicEid
 *         schema:
 *           type: string
 *         required: true
 *         description: Epic's identifier.
 *     tags:
 *       - epic
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EpicResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.delete("/api/epic/:projectEid/:epicEid/delete", authorize(), authorizeProject(), async (req, res) => {
	await handle("epic", "delete", req, res);
});

export default router;
