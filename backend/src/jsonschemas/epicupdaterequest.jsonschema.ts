export const epicUpdateRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "EpicUpdateRequest",
	type: "object",
	properties: {
		code: {
			type: "string",
			maxLength: 15,
			minLength: 1,
		},
		title: {
			type: "string",
			maxLength: 128,
			minLength: 1,
		},
		description: {
			type: "string",
			maxLength: 256,
			minLength: 1,
		},
	},
	required: [],
	additionalProperties: false,
};
