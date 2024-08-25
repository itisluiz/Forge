export const projectNewRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "ProjectNewRequest",
	type: "object",
	properties: {
		code: {
			type: "string",
			maxLength: 3,
			minLength: 3,
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
	},
	required: ["code", "title", "description"],
	additionalProperties: false,
};
