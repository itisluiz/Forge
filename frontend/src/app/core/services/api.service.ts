import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenService } from "./token.service";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	constructor(
		private http: HttpClient,
		private token: TokenService,
	) {}

	public call<T>(verb: string, endpoint: string, urlParams?: { [key: string]: any }, body?: any): Observable<T> {
		const url = `/api/${endpoint}`;

		const token = this.token.get();
		const headers = {
			"Content-Type": "application/json",
			Accept: "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
		};

		const params = urlParams ? new HttpParams({ fromObject: urlParams }) : undefined;
		return this.http.request<T>(verb, url, { params, body, headers, responseType: "json" });
	}
}
