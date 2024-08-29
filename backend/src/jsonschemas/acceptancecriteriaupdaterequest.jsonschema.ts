export const acceptanceCriteriaUpdateRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "AcceptanceCriteriaupdaterequest",
	type: "object",
	properties: {
		given: {
			type: "string",
			maxLength: 128,
			minLength: 1,
		},
		when: {
			type: "string",
			maxLength: 128,
			minLength: 1,
		},
		then: {
			type: "string",
			maxLength: 128,
			minLength: 1,
		},
	},
	required: [],
	additionalProperties: false,
};
