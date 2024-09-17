export const planningpokerVoteRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "PlanningpokerVoteRequestJsonSchema",
	type: "object",
	properties: {
		vote: {
			type: ["null", "integer"],
			enum: [null, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
		},
	},
	required: [],
	additionalProperties: false,
};
