export const userstoryNewRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "UserstoryNewRequest",
	type: "object",
	properties: {
		epicEid: {
			type: "string",
			minLength: 8,
			maxLength: 8,
		},
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
		narrative: {
			type: "string",
			maxLength: 256,
			minLength: 1,
		},
		premisse: {
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
	required: [
		"epicEid",
		"title",
		"description",
		"narrative",
		"premisse",
		"storyActor",
		"storyObjective",
		"storyJustification",
		"priority",
	],
	additionalProperties: false,
};
