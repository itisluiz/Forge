export const testcaseSuggestionRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "TestcaseSuggestionRequest",
	type: "object",
	properties: {
		acceptancecriteriaEid: {
			type: "string",
		},
		prompt: {
			type: "string",
		},
	},
	required: ["acceptancecriteriaEid"],
	additionalProperties: false,
};
