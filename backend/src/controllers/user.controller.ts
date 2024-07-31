import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { Router } from "express";
import { userSignupRequestJsonSchema } from "../jsonschemas/usersignuprequest.jsonschema.js";

const router = Router();

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Sign up a new user account.
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignupRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSigninResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post("/api/user/signup", jsonBody(), jsonBodySchema(userSignupRequestJsonSchema), async (req, res) => {
	await handle("user", "signup", req, res);
});

export default router;
