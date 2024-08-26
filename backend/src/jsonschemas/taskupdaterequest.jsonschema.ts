export const taskUpdateRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "TaskUpdateRequest",
	type: "object",
	properties: {
		responsibleEid: {
			type: ["string", "null"],
			minLength: 8,
			maxLength: 8,
		},
		title: {
			type: "string",
			maxLength: 64,
			minLength: 1,
		},
		description: {
			type: "string",
			maxLength: 256,
			minLength: 1,
		},
		status: {
			type: "integer",
			minimum: 1,
		},
		type: {
			type: "integer",
			minimum: 1,
		},
	},
	required: [],
	additionalProperties: false,
};
