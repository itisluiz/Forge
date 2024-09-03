export const projectKickRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "ProjectKickRequestJsonSchema",
	type: "object",
	properties: {
		eid: {
			type: "string",
			minLength: 8,
			maxLength: 8,
		},
	},
	required: ["eid"],
	additionalProperties: false,
};
