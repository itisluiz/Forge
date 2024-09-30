import { testcaseNewRequestJsonSchema } from "../jsonschemas/testcasenewrequest.jsonschema.js";
import { testcaseUpdateRequestJsonSchema } from "../jsonschemas/testcaseupdaterequest.jsonschema.js";
import { authorize } from "../middleware/auth.middleware.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/testcase/{projectEid}/new:
 *   post:
 *     summary: Create a new test case.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - testcase
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestcaseNewRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestcaseResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	"/api/testcase/:projectEid/new",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(testcaseNewRequestJsonSchema),
	async (req, res) => {
		await handle("testcase", "new", req, res);
	},
);

/**
 * @swagger
 * /api/testcase/{projectEid}/{testcaseEid}/update:
 *   patch:
 *     summary: Updates an existing test case.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: testcaseEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The test case's identifier.
 *     tags:
 *       - testcase
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestcaseUpdateRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestcaseResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.patch(
	"/api/testcase/:projectEid/:testcaseEid/update",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(testcaseUpdateRequestJsonSchema),
	async (req, res) => {
		await handle("testcase", "update", req, res);
	},
);

/**
 * @swagger
 * /api/testcase/{projectEid}/{acceptancecriteriaEid}/self:
 *   get:
 *     summary: Get all test cases for the given acceptance criteria.
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
 *       - testcase
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestcaseSelfResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/testcase/:projectEid/:acceptancecriteriaEid/self", authorize(), authorizeProject(), async (req, res) => {
	await handle("testcase", "self", req, res);
});

/**
 * @swagger
 * /api/testcase/{projectEid}/{testcaseEid}/get:
 *   get:
 *     summary: Get a test case by its identifier.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: testcaseEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The test case's identifier.
 *     tags:
 *       - testcase
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestcaseResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/testcase/:projectEid/:testcaseEid/get", authorize(), authorizeProject(), async (req, res) => {
	await handle("testcase", "get", req, res);
});

/**
 * @swagger
 * /api/testcase/{projectEid}/{testcaseEid}/delete:
 *   delete:
 *     summary: Delete a test case by its identifier.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: testcaseEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The test case's identifier.
 *     tags:
 *       - testcase
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
router.delete("/api/testcase/:projectEid/:testcaseEid/delete", authorize(), authorizeProject(), async (req, res) => {
	await handle("testcase", "delete", req, res);
});

export default router;
