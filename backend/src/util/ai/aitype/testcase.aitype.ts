import { AIType } from "./aitype.js";
import { AITestCase } from "forge-shared/dto/aitestcase.dto";

const mocks: AITestCase[] = [
	{
		title: "User login with valid credentials",
		steps: [
			"Open the browser",
			"Navigate to the website",
			"Enter the username",
			"Enter the password",
			"Click the login button",
		],
	},
	{
		title: "Add item to cart",
		steps: ["Open the browser", "Navigate to the website", "Search for the item", "Click the add to cart button"],
	},
];

const description = {
	title: "<str: Title>",
	steps: "<str[]: Steps>",
};

export default { mocks, description } as AIType<AITestCase>;
