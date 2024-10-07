export const testcaseSuggestionResponseJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "TestcaseSuggestionResponse",
	type: "object",
	properties: {
		description: {
			type: "string",
		},
		precondition: {
			type: "string",
		},
		steps: {
			type: "array",
			items: {
				type: "object",
				properties: {
					action: {
						type: "string",
					},
					expectedBehavior: {
						type: "string",
					},
				},
				required: ["action", "expectedBehavior"],
				additionalProperties: false,
			},
		},
	},
	required: ["description", "precondition", "steps"],
	additionalProperties: false,
};
