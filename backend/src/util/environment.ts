import { join } from "path";
import { fileURLToPath } from "url";

process.env["ROOT_DIR"] = join(fileURLToPath(import.meta.url), "../../..");
process.env["FRONTEND_DIR"] = join(process.env["ROOT_DIR"], process.env["FRONTEND_RELATIVE_DIR"] as string);
