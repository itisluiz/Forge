export const planningpokerCreatesessionRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "PlanningpokerCreatesessionRequestJsonSchema",
	type: "object",
	properties: {
		agenda: {
			type: "string",
			maxLength: 128,
			minLength: 1,
		},
		sprintEid: {
			type: "string",
			maxLength: 8,
			minLength: 8,
		},
	},
	required: ["agenda", "sprintEid"],
	additionalProperties: false,
};
