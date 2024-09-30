export const testcaseUpdateRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "TestcaseUpdateRequest",
	type: "object",
	properties: {
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
		},
	},
	required: [],
	additionalProperties: false,
};
