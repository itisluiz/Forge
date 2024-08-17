export const projectMakeInvitationRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "ProjectMakeInvitationRequest",
	type: "object",
	properties: {
		uses: {
			type: "integer",
			minimum: 1,
		},
		durationHours: {
			type: "number",
			exclusiveMinimum: 0,
		},
		role: {
			type: "integer",
			minimum: 1,
		},
	},
	required: ["uses", "durationHours", "role"],
	additionalProperties: false,
};
