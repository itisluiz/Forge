export const planningpokerSetuserstoryRequestJsonSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "PlanningpokerSetuserstoryRequestJsonSchema",
	type: "object",
	properties: {
		userstoryEid: {
			type: "string",
			maxLength: 8,
			minLength: 8,
		},
	},
	required: ["userstoryEid"],
	additionalProperties: false,
};
