import { authorize } from "../middleware/auth.middleware.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { planningpokerCreatesessionRequestJsonSchema } from "../jsonschemas/planningpokercreatesessionrequest.jsonschema.js";
import { planningpokerSettaskRequestJsonSchema } from "../jsonschemas/planningpokersettaskrequest.jsonschema.js";
import { planningpokerVoteRequestJsonSchema } from "../jsonschemas/planningpokervoterequest.jsonschema.js";
import { ProjectRole } from "forge-shared/enum/projectrole.enum.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/planningpoker/{projectEid}/createsession:
 *   post:
 *     summary: Create a new planning poker session.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *     tags:
 *       - planningpoker
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanningpokerCreatesessionRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanningpokerCreatesessionResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	"/api/planningpoker/:projectEid/createsession",
	authorize(),
	authorizeProject(false, [ProjectRole.SCRUM_MASTER]),
	jsonBody(),
	jsonBodySchema(planningpokerCreatesessionRequestJsonSchema),
	async (req, res) => {
		await handle("planningpoker", "createsession", req, res);
	},
);

/**
 * @swagger
 * /api/planningpoker/{projectEid}/{sessionCode}/settask:
 *   post:
 *     summary: Set the task currently being voted in the planning poker session.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: sessionCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The planning poker's session code.
 *     tags:
 *       - planningpoker
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanningpokerSettaskRequest'
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
router.post(
	"/api/planningpoker/:projectEid/:sessionCode/settask",
	authorize(),
	authorizeProject(false, [ProjectRole.SCRUM_MASTER]),
	jsonBody(),
	jsonBodySchema(planningpokerSettaskRequestJsonSchema),
	async (req, res) => {
		await handle("planningpoker", "settask", req, res);
	},
);

/**
 * @swagger
 * /api/planningpoker/{projectEid}/{sessionCode}/revealvotes:
 *   post:
 *     summary: Reveals the votes in the planning poker session.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: sessionCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The planning poker's session code.
 *     tags:
 *       - planningpoker
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
router.post(
	"/api/planningpoker/:projectEid/:sessionCode/revealvotes",
	authorize(),
	authorizeProject(false, [ProjectRole.SCRUM_MASTER]),
	async (req, res) => {
		await handle("planningpoker", "revealvotes", req, res);
	},
);

/**
 * @swagger
 * /api/planningpoker/{projectEid}/{sessionCode}/saveresult:
 *   post:
 *     summary: Saves a voting result the currently voted task.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: sessionCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The planning poker's session code.
 *     tags:
 *       - planningpoker
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanningpokerVoteRequest'
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
router.post(
	"/api/planningpoker/:projectEid/:sessionCode/saveresult",
	authorize(),
	authorizeProject(false, [ProjectRole.SCRUM_MASTER]),
	jsonBody(),
	jsonBodySchema(planningpokerVoteRequestJsonSchema),
	async (req, res) => {
		await handle("planningpoker", "saveresult", req, res);
	},
);

/**
 * @swagger
 * /api/planningpoker/{projectEid}/{sessionCode}/vote:
 *   post:
 *     summary: Set the calling user's vote in the planning poker session.
 *     parameters:
 *       - in: path
 *         name: projectEid
 *         schema:
 *           type: string
 *         required: true
 *         description: The project's identifier.
 *       - in: path
 *         name: sessionCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The planning poker's session code.
 *     tags:
 *       - planningpoker
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanningpokerVoteRequest'
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
router.post(
	"/api/planningpoker/:projectEid/:sessionCode/vote",
	authorize(),
	authorizeProject(),
	jsonBody(),
	jsonBodySchema(planningpokerVoteRequestJsonSchema),
	async (req, res) => {
		await handle("planningpoker", "vote", req, res);
	},
);

/**
 * @swagger
 * /api/planningpoker/{sessionCode}:
 *   get:
 *     summary: Get the updated planning poker session data. Meant to be polled.
 *     parameters:
 *         name: sessionCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The planning poker's session code.
 *     tags:
 *       - planningpoker
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanningpokerResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post("/api/planningpoker/:sessionCode", async (req, res) => {
	await handle("planningpoker", "get", req, res);
});

export default router;
