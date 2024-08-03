import "express-async-errors";
import { fileURLToPath } from "url";
import { join } from "path";

process.env["ROOT_DIR"] = join(fileURLToPath(import.meta.url), "../../..");
process.env["FRONTEND_DIR"] = join(process.env["ROOT_DIR"], process.env["FRONTEND_RELATIVE_DIR"] as string);
