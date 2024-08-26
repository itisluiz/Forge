import { authorize } from "../middleware/auth.middleware.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { Router } from "express";
import { taskNewRequestJsonSchema } from "../jsonschemas/tasknewrequest.jsonschema.js";
import { taskUpdateRequestJsonSchema } from "../jsonschemas/taskupdaterequest.jsonschema.js";

const router = Router();

/**
 * @swagger
 * /api/task/{projectEid}/new:
 *   post:
 *     summary: Create a new task.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskNewRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	"/api/task/:projectEid/new",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(taskNewRequestJsonSchema),
	async (req, res) => {
		await handle("task", "new", req, res);
	},
);

/**
 * @swagger
 * /api/task/{projectEid}/{taskEid}/update:
 *   patch:
 *     summary: Updates an existing task.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: taskEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The task's identifier.
 *     tags:
 *       - task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.patch(
	"/api/task/:projectEid/:taskEid/update",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(taskUpdateRequestJsonSchema),
	async (req, res) => {
		await handle("task", "update", req, res);
	},
);

/**
 * @swagger
 * /api/task/{projectEid}/{userstoryEid}/self:
 *   get:
 *     summary: Get all tasks for the given user story.
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
 *       - task
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskSelfResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/task/:projectEid/:userstoryEid/self", authorize(), authorizeProject(), async (req, res) => {
	await handle("task", "self", req, res);
});

/**
 * @swagger
 * /api/task/{projectEid}/{taskEid}/get:
 *   get:
 *     summary: Get an task by its identifier.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: taskEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The task's identifier.
 *     tags:
 *       - task
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/task/:projectEid/:taskEid/get", authorize(), authorizeProject(), async (req, res) => {
	await handle("task", "get", req, res);
});

/**
 * @swagger
 * /api/task/{projectEid}/{taskEid}/delete:
 *   delete:
 *     summary: Delete an task by its identifier.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: taskEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The task's identifier.
 *     tags:
 *       - task
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
router.delete("/api/task/:projectEid/:taskEid/delete", authorize(), authorizeProject(), async (req, res) => {
	await handle("task", "delete", req, res);
});

export default router;
