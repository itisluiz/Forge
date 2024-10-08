export const sprintUpdateRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "SprintUpdateRequest",
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
			type: ["null", "integer"],
			minimum: 1,
		},
	},
	required: [],
	additionalProperties: false,
};
