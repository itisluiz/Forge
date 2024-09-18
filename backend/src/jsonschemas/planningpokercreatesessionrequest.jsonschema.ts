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
		userstoryEids: {
			type: "array",
			minItems: 1,
			items: {
				type: "string",
				minLength: 8,
				maxLength: 8,
			},
		},
	},
	required: ["agenda", "userstoryEids"],
	additionalProperties: false,
};
