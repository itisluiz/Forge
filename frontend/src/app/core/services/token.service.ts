import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class TokenService {
	private tokenKey = "token";

	public get() {
		return localStorage.getItem(this.tokenKey);
	}

	public set(token: string) {
		localStorage.setItem(this.tokenKey, token);
	}

	public delete() {
		return localStorage.removeItem(this.tokenKey);
	}
}
