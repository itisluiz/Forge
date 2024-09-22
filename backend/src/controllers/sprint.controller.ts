import { authorize } from "../middleware/auth.middleware.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { Router } from "express";
import { sprintNewRequestJsonSchema } from "../jsonschemas/sprintnewrequest.jsonschema.js";
import { sprintUpdateRequestJsonSchema } from "../jsonschemas/sprintupdaterequest.jsonschema.js";

const router = Router();

/**
 * @swagger
 * /api/sprint/{projectEid}/new:
 *   post:
 *     summary: Create a new sprint.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - sprint
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SprintNewRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SprintResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	"/api/sprint/:projectEid/new",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(sprintNewRequestJsonSchema),
	async (req, res) => {
		await handle("sprint", "new", req, res);
	},
);

/**
 * @swagger
 * /api/sprint/{projectEid}/{sprintEid}/update:
 *   patch:
 *     summary: Updates an existing sprint.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: sprintEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The sprint's identifier.
 *     tags:
 *       - sprint
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SprintUpdateRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SprintResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.patch(
	"/api/sprint/:projectEid/:sprintEid/update",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(sprintUpdateRequestJsonSchema),
	async (req, res) => {
		await handle("sprint", "update", req, res);
	},
);

/**
 * @swagger
 * /api/sprint/{projectEid}/self:
 *   get:
 *     summary: Get all sprints for the given project.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - sprint
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SprintSelfResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/sprint/:projectEid/self", authorize(), authorizeProject(), async (req, res) => {
	await handle("sprint", "self", req, res);
});

/**
 * @swagger
 * /api/sprint/{projectEid}/current:
 *   get:
 *     summary: Get the ongoing/current sprint, or null if there is none.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - sprint
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SprintMonadResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/sprint/:projectEid/current", authorize(), authorizeProject(), async (req, res) => {
	await handle("sprint", "current", req, res);
});

/**
 * @swagger
 * /api/sprint/{projectEid}/{sprintEid}/get:
 *   get:
 *     summary: Get a sprint by its identifier.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: sprintEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The sprint's identifier.
 *     tags:
 *       - sprint
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SprintResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/sprint/:projectEid/:sprintEid/get", authorize(), authorizeProject(), async (req, res) => {
	await handle("sprint", "get", req, res);
});

/**
 * @swagger
 * /api/sprint/{projectEid}/{sprintEid}/delete:
 *   delete:
 *     summary: Delete a sprint by its identifier.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: sprintEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The sprint's identifier.
 *     tags:
 *       - sprint
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
router.delete("/api/sprint/:projectEid/:sprintEid/delete", authorize(), authorizeProject(), async (req, res) => {
	await handle("sprint", "delete", req, res);
});

export default router;
