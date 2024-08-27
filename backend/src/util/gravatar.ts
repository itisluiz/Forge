import crypto from "crypto";
import NodeCache from "node-cache";

const emailHashCache = new NodeCache();

export function getGravatarUrl(email: string): string {
	email = email.trim().toLowerCase();

	if (!emailHashCache.has(email)) {
		const emailHash = crypto.createHash("sha256").update(email);
		emailHashCache.set(email, emailHash.digest("hex"));
	}

	return `https://www.gravatar.com/avatar/${emailHashCache.get(email)}?d=identicon`;
}
