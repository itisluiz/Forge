export const testcaseNewRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "TestcaseNewRequest",
	type: "object",
	properties: {
		acceptancecriteriaEid: {
			type: "string",
			minLength: 8,
			maxLength: 8,
		},
		description: {
			type: "string",
			maxLength: 256,
		},
		precondition: {
			type: "string",
			maxLength: 256,
		},
		steps: {
			type: "array",
			items: {
				type: "object",
				properties: {
					action: {
						type: "string",
						maxLength: 256,
					},
					expectedBehavior: {
						type: "string",
						maxLength: 256,
					},
				},
				required: ["action", "expectedBehavior"],
			},
			minItems: 1,
		},
	},
	required: ["acceptancecriteriaEid", "description", "precondition", "steps"],
	additionalProperties: false,
};
