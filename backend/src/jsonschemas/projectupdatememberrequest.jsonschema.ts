export const projectUpdateMemberRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "ProjectUpdateMemberRequest",
	type: "object",
	properties: {
		eid: {
			type: "string",
			minLength: 8,
			maxLength: 8,
		},
		role: {
			type: "integer",
			minimum: 1,
		},
		admin: {
			type: "boolean",
		},
	},
	required: ["eid"],
	additionalProperties: false,
};
