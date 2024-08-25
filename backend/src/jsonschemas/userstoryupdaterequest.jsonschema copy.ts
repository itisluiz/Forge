export const userstoryUpdateRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "UserstoryUpdateRequest",
	type: "object",
	properties: {
		sprintEid: {
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
		storyActor: {
			type: "string",
			maxLength: 128,
			minLength: 1,
		},
		storyObjective: {
			type: "string",
			maxLength: 128,
			minLength: 1,
		},
		storyJustification: {
			type: "string",
			maxLength: 128,
			minLength: 1,
		},
		priority: {
			type: "integer",
			minimum: 1,
		},
	},
	required: [],
	additionalProperties: false,
};
