export const projectUseInvitationJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "ProjectUseInvitationJsonSchema",
	type: "object",
	properties: {
		code: {
			type: "string",
			maxLength: 24,
			minLength: 24,
		},
	},
	required: ["code"],
	additionalProperties: false,
};
