import { acceptanceCriteriaNewRequestJsonSchema } from "../jsonschemas/acceptancecriterianewrequest.jsonschema.js";
import { acceptanceCriteriaUpdateRequestJsonSchema } from "../jsonschemas/acceptancecriteriaupdaterequest.jsonschema.js";
import { authorize } from "../middleware/auth.middleware.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/acceptancecriteria/{projectEid}/new:
 *   post:
 *     summary: Create a new acceptance criteria.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - acceptancecriteria
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcceptanceCriteriaNewRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcceptanceCriteriaResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	"/api/acceptancecriteria/:projectEid/new",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(acceptanceCriteriaNewRequestJsonSchema),
	async (req, res) => {
		await handle("acceptancecriteria", "new", req, res);
	},
);

/**
 * @swagger
 * /api/acceptancecriteria/{projectEid}/{acceptancecriteriaEid}/update:
 *   patch:
 *     summary: Updates an existing acceptance criteria.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: acceptancecriteriaEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The acceptance criteria's identifier.
 *     tags:
 *       - acceptancecriteria
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcceptanceCriteriaUpdateRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcceptanceCriteriaResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.patch(
	"/api/acceptancecriteria/:projectEid/:acceptancecriteriaEid/update",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(acceptanceCriteriaUpdateRequestJsonSchema),
	async (req, res) => {
		await handle("acceptancecriteria", "update", req, res);
	},
);

/**
 * @swagger
 * /api/acceptancecriteria/{projectEid}/{userstoryEid}/self:
 *   get:
 *     summary: Get all acceptance criteria for the given user story.
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
 *       - acceptancecriteria
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcceptanceCriteriaSelfResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/acceptancecriteria/:projectEid/:userstoryEid/self", authorize(), authorizeProject(), async (req, res) => {
	await handle("acceptancecriteria", "self", req, res);
});

/**
 * @swagger
 * /api/acceptancecriteria/{projectEid}/{acceptancecriteriaEid}/get:
 *   get:
 *     summary: Get an acceptance criteria by its identifier.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: acceptancecriteriaEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The acceptance criteria's identifier.
 *     tags:
 *       - acceptancecriteria
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcceptanceCriteriaResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	"/api/acceptancecriteria/:projectEid/:acceptancecriteriaEid/get",
	authorize(),
	authorizeProject(),
	async (req, res) => {
		await handle("acceptancecriteria", "get", req, res);
	},
);

/**
 * @swagger
 * /api/acceptancecriteria/{projectEid}/{acceptancecriteriaEid}/delete:
 *   delete:
 *     summary: Delete an acceptance criteria by its identifier.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: acceptancecriteriaEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The acceptance criteria's identifier.
 *     tags:
 *       - acceptancecriteria
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
router.delete(
	"/api/acceptancecriteria/:projectEid/:acceptancecriteriaEid/delete",
	authorize(),
	authorizeProject(),
	async (req, res) => {
		await handle("acceptancecriteria", "delete", req, res);
	},
);

export default router;
