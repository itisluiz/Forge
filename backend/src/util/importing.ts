import { readdirSync } from "fs";

export async function directoryImport(dirPath: string, extension = ".js") {
	const files = readdirSync(dirPath).filter((file) => file.endsWith(extension));

	const results = await Promise.all(files.map((file) => import(`../../${dirPath}/${file}`)));

	return files.reduce((acc: { [key: string]: any }, file, index) => {
		acc[file.split(".")[0]] = results[index];
		return acc;
	}, {});
}

export async function directoryNestedImport(dirPath: string, extension = ".js") {
	const directories = readdirSync(dirPath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	const results = await Promise.all(directories.map((directory) => directoryImport(`${dirPath}/${directory}`, extension)));

	return directories.reduce((acc: { [key: string]: any }, directory, index) => {
		acc[directory] = results[index];
		return acc;
	}, {});
}
