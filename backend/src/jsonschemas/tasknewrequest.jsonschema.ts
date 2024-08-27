export const taskNewRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "TaskNewRequest",
	type: "object",
	properties: {
		userstoryEid: {
			type: "string",
			minLength: 8,
			maxLength: 8,
		},
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
	required: ["userstoryEid", "title", "description", "status", "type"],
	additionalProperties: false,
};
