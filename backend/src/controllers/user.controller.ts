import { handle } from "../util/handle.js";
import { jsonBody, jsonBodySchema } from "../middleware/json.middleware.js";
import { Router } from "express";
import { userSigninRequestJsonSchema } from "../jsonschemas/usersigninrequest.jsonschema.js";
import { userSignupRequestJsonSchema } from "../jsonschemas/usersignuprequest.jsonschema.js";
import { authorize } from "../middleware/auth.middleware.js";

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

/**
 * @swagger
 * /api/user/signin:
 *   post:
 *     summary: Sign in an existing user account.
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSigninRequest'
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
router.post("/api/user/signin", jsonBody(), jsonBodySchema(userSigninRequestJsonSchema), async (req, res) => {
	await handle("user", "signin", req, res);
});

/**
 * @swagger
 * /api/user/self:
 *   get:
 *     summary: Get information about the requesting user.
 *     tags:
 *       - user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSelfResponse'
 *       Others:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get("/api/user/self", authorize(), async (req, res) => {
	await handle("user", "self", req, res);
});

export default router;
