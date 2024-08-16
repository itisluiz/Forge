import { authorize } from "../middleware/auth.middleware.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { projectMakeInvitationRequestJsonSchema } from "../jsonschemas/projectmakeinvitationrequest.jsonschema.js";
import { projectNewRequestJsonSchema } from "../jsonschemas/projectnewrequest.jsonschema.js";
import { projectUpdateRequestJsonSchema } from "../jsonschemas/projectupdaterequest.jsonschema.js";
import { projectUseInvitationJsonSchema } from "../jsonschemas/projectuseinvitation.jsonschema.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/project/new:
 *   post:
 *     summary: Create a new project.
 *     tags:
 *       - project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectNewRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post("/api/project/new", authorize(), jsonBody(), jsonBodySchema(projectNewRequestJsonSchema), async (req, res) => {
	await handle("project", "new", req, res);
});

/**
 * @swagger
 * /api/project/useinvitation:
 *   post:
 *     summary: Use an invitation code to join a project.
 *     tags:
 *       - project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectUseInvitationRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	"/api/project/useinvitation",
	authorize(),
	jsonBody(),
	jsonBodySchema(projectUseInvitationJsonSchema),
	async (req, res) => {
		await handle("project", "useinvitation", req, res);
	},
);

/**
 * @swagger
 * /api/project/{projectEid}/makeinvitation:
 *   post:
 *     summary: Create a new invitation code for the project.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectMakeInvitationRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectMakeInvitationResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	"/api/project/:projectEid/makeinvitation",
	authorize(),
	authorizeProject(true),
	jsonBody(),
	jsonBodySchema(projectMakeInvitationRequestJsonSchema),
	async (req, res) => {
		await handle("project", "makeinvitation", req, res);
	},
);

/**
 * @swagger
 * /api/project/{projectEid}/update:
 *   patch:
 *     summary: Update an existing project's information.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectUpdateRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.patch(
	"/api/project/:projectEid/update",
	authorize(),
	authorizeProject(true),
	jsonBody(),
	jsonBodySchema(projectUpdateRequestJsonSchema),
	async (req, res) => {
		await handle("project", "update", req, res);
	},
);

/**
 * @swagger
 * /api/project/self:
 *   get:
 *     summary: Gets all the project the requesting user is a member of.
 *     tags:
 *       - project
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectSelfResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/project/self", authorize(), async (req, res) => {
	await handle("project", "self", req, res);
});

/**
 * @swagger
 * /api/project/{projectEid}/get:
 *   get:
 *     summary: Get information about a specific project the requesting user is a member of.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - project
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/project/:projectEid/get", authorize(), authorizeProject(), async (req, res) => {
	await handle("project", "get", req, res);
});

/**
 * @swagger
 * /api/project/{projectEid}/invitations:
 *   get:
 *     summary: Get a list of invitations for a specific project.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - project
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectInvitationsResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/project/:projectEid/invitations", authorize(), authorizeProject(true), async (req, res) => {
	await handle("project", "invitations", req, res);
});

export default router;
