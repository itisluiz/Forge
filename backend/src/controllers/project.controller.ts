import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { projectNewRequestJsonSchema } from "../jsonschemas/projectnewrequest.jsonschema.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { projectUpdateRequestJsonSchema } from "../jsonschemas/projectupdaterequest.jsonschema.js";

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
 * /api/project/{eid}/update:
 *   patch:
 *     summary: Update an existing project's information.
 *     parameters:
 *       - in: path
 *         name: eid
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
	"/api/project/:eid/update",
	authorize(),
	authorizeProject(true),
	jsonBody(),
	jsonBodySchema(projectUpdateRequestJsonSchema),
	async (req, res) => {
		await handle("project", "update", req, res);
	},
);

export default router;
