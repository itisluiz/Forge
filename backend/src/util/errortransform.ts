const errorTransformers: { condition: any; transform: any }[] = [];

export function registerErrorTransformer(condition: any, transform: any) {
	errorTransformers.push({ condition, transform });
}

export function errorTransform(error: any) {
	for (const transformer of errorTransformers) {
		if (transformer.condition(error)) {
			return transformer.transform(error);
		}
	}

	return error;
}
