import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ObservableInput, catchError } from "rxjs";
import { TokenService } from "./token.service";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	constructor(
		private httpClient: HttpClient,
		private tokenService: TokenService,
	) {}

	private catchErrorHandler<T>(error: HttpErrorResponse, caught: Observable<T>): ObservableInput<any> {
		// TODO: Toaster com erro
		throw error;
	}

	public call<T, Q = unknown>(verb: HttpMethod, endpoint: string, params?: HttpParams, body?: Q): Observable<T> {
		const url = `/api/${endpoint}`;

		const token = this.tokenService.get();
		const headers = {
			"Content-Type": "application/json",
			Accept: "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
		};

		return this.httpClient
			.request<T>(verb, url, { params, body, headers, responseType: "json" })
			.pipe(catchError(this.catchErrorHandler.bind(this)));
	}
}
