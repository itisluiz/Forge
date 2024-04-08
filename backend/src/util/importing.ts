import { readdirSync } from "fs";

export async function directoryImport(dirPath: string, extension = ".js") {
	const files = readdirSync(dirPath).filter((file) => file.endsWith(extension));

	const results = await Promise.all(files.map((file) => import(`../../${dirPath}/${file}`)));

	return files.reduce((acc: { [key: string]: any }, file, index) => {
		acc[file.split(".")[0]] = results[index];
		return acc;
	}, {});
}
