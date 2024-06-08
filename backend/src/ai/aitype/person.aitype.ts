import { AIType } from "./aitype.js";
import { Person } from "forge-shared/dto/person.dto";
import { Priority } from "forge-shared/enum/priority.enum";

const mocks: Person[] = [
	{
		name: "John Doe",
		age: 42,
		priority: Priority.HIGH,
	},
];

const description = {
	name: "<str: Name>",
	age: "<int: Age>",
	priority: "<int: 0 = Low, 1 = Medium, 2 = High>",
};

export default { mocks, description } as AIType<Person>;
