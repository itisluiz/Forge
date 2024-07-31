import { directoryImport } from "../util/importing.js";
import { registerErrorTransformer } from "../util/errortransform.js";

export async function setupErrorTransformers() {
	const errorTransformers = await directoryImport("dist/error/errortransformers", ".errortransformer.js");
	for (const name in errorTransformers) {
		registerErrorTransformer(errorTransformers[name].condition, errorTransformers[name].transform);
	}
}
