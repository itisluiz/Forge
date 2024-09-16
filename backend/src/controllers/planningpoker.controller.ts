import { authorize } from "../middleware/auth.middleware.js";
import { authorizeProject } from "../middleware/authproject.middleware.js";
import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { planningpokerSessionRequestJsonSchema } from "../jsonschemas/planningpokersessionrequest.jsonschema.js";
import { Router } from "express";
import { ProjectRole } from "forge-shared/enum/projectrole.enum.js";

const router = Router();

/**
 * @swagger
 * /api/planningpoker/{projectEid}/createsession:
 *   post:
 *     summary: Create a new Planning Poker session.
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
 *             $ref: '#/components/schemas/PlanningpokerSessionRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanningpokerSessionResponse'
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
	jsonBodySchema(planningpokerSessionRequestJsonSchema),
	async (req, res) => {
		await handle("planningpoker", "createsession", req, res);
	},
);

export default router;
