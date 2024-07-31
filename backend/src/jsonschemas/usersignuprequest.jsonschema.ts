export const userSignupRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "UserSignupRequest",
	type: "object",
	properties: {
		email: {
			type: "string",
			format: "email",
			maxLength: 128,
			minLength: 1,
		},
		password: {
			type: "string",
			maxLength: 64,
			minLength: 8,
		},
		name: {
			type: "string",
			maxLength: 64,
			minLength: 1,
		},
		surname: {
			type: "string",
			maxLength: 64,
			minLength: 1,
		},
	},
	required: ["email", "password", "name", "surname"],
	additionalProperties: false,
};
