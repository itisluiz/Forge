import { Router } from "express";
import { Person } from "forge-shared/dto/person.dto";
import { Priority } from "forge-shared/enum/priority.enum";

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

export default router;
