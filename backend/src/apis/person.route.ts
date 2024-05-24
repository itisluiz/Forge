import { Router } from "express";
import { Person } from "forge-shared/dto/person.dto";
import { Priority } from "forge-shared/enum/priority.enum";
import logging from "../util/logging.js";
import { promptAI } from "../util/ai.js";

const router = Router();

/**
 * @swagger
 * /api/person:
 *   get:
 *     summary: Get a sample person object.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 */
router.get("/api/person", (req, res) => {
	const sample: Person = {
		name: "John Doe",
		age: 42,
		priority: Priority.HIGH,
	};

	res.json(sample);
});

/**
 * @swagger
 * /api/testcaseai:
 *   post:
 *     summary: Generate a test case based on acceptance criteria.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               acceptanceCriteria:
 *                 type: string
 *             example:
 *               acceptanceCriteria: "The user should be able to login with valid credentials."
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                 precondition:
 *                   type: string
 *                 steps:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       action:
 *                         type: string
 *                       expected:
 *                         type: string
 */
router.post("/api/testcaseai", async (req, res) => {
	const acceptanceCriteria = req.body.acceptanceCriteria;
	logging.logDebug("testcaseai", acceptanceCriteria);

	const resultado = await promptAI(
		[
			{
				role: "system",
				content: `Você vai ajudar a gerar um caso de teste com três passos baseado em um critério de aceite
		fornecido pelo usuário: "${acceptanceCriteria}", pode assumir todos os detalhes que precisar sobre o projeto de forma que faça sentido
		e a resposta que você deve fornecer é em um formato específico de JSON que deve ser seguido estritamente.
		O formato do JSON é o seguinte:
		{
			"description": "",
			"precondition": "",
			"steps": [
					{
							"action": "",
							"expected": ""
					},
					{
							"action": "",
							"expected": ""
					},
					{
							"action": "",
							"expected": ""
					}
			]
		}

		Com exatemente três steps. Busque não se estender muito, mas também não seja muito sucinto.`,
			},
		],
		true,
	);

	res.json(resultado);
});

export default router;
