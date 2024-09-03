export const acceptanceCriteriaNewRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "AcceptanceCriteriaNewRequest",
	type: "object",
	properties: {
		userstoryEid: {
			type: "string",
			minLength: 8,
			maxLength: 8,
		},
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
	required: ["userstoryEid", "given", "when", "then"],
	additionalProperties: false,
};
