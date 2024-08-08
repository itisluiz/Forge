export const userSigninRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "UserSigninRequest",
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
			maxLength: 256,
			minLength: 1,
		},
	},
	required: ["email", "password"],
	additionalProperties: false,
};
