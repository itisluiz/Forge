import { Person } from "forge-shared/dto/person.dto";
import { Priority } from "forge-shared/enum/priority.enum";
import { Response } from "express";

export default async function (req: Request, res: Response) {
	const sample: Person = {
		name: "John Doe",
		age: 42,
		priority: Priority.HIGH,
	};

	res.json(sample);
}
