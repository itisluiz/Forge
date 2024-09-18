export const planningpokerSettaskRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "PlanningpokerSettaskRequestJsonSchema",
	type: "object",
	properties: {
		taskEid: {
			type: "string",
			maxLength: 8,
			minLength: 8,
		},
	},
	required: ["taskEid"],
	additionalProperties: false,
};
