export const sprintNewRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "SprintNewRequest",
	type: "object",
	properties: {
		startsAt: {
			type: "string",
			format: "date-time",
		},
		endsAt: {
			type: "string",
			format: "date-time",
		},
		status: {
			type: "integer",
			minimum: 1,
		},
		targetVelocity: {
			type: "integer",
			minimum: 1,
		},
	},
	required: ["startsAt", "endsAt", "status"],
	additionalProperties: false,
};
