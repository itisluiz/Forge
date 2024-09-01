import { FailureResponse } from "forge-shared/dto/response/failureresponse.dto";
import { FailureType } from "forge-shared/enum/failuretype.enum";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ObservableInput, catchError, tap } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TokenService } from "./token.service";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type HandlingOptions = {
	showErrorToast?: boolean;
	showSuccessToast?: boolean;
	redirectOnNotAuthenticated?: boolean;
	redirectOnUnauthorized?: boolean;
	successMessage?: string;
};

export interface ApiErrorResponse extends HttpErrorResponse {
	error: FailureResponse | null;
}

@Injectable({
	providedIn: "root",
})
export class ApiService {
	constructor(
		private httpClient: HttpClient,
		private tokenService: TokenService,
		private toastrService: ToastrService,
		private router: Router,
	) {}

	private catchErrorHandler<T>(
		handlingOptions: HandlingOptions,
		error: ApiErrorResponse,
		caught: Observable<T>,
	): ObservableInput<any> {
		if (error.error?.failureType === FailureType.NOTAUTHENTICATED && handlingOptions.redirectOnNotAuthenticated) {
			this.tokenService.delete();
			this.router.navigate(["/login"]);
			throw error;
		}

		if (error.error?.failureType === FailureType.UNAUTHORIZED && handlingOptions.redirectOnUnauthorized) {
			this.toastrService.warning(error.error?.message, error.statusText);
			this.router.navigate(["/"]);
			throw error;
		}

		if (handlingOptions.showErrorToast) {
			this.toastrService.error(error.error?.message ?? "Unexpected error", error.statusText ?? "Error");
		}

		throw error;
	}

	private catchSuccessHandler(handlingOptions: HandlingOptions, response: any): void {
		if (handlingOptions.showSuccessToast) {
			this.toastrService.success(handlingOptions.successMessage);
		}
	}

	public call<T, Q = unknown>(
		verb: HttpMethod,
		endpoint: string,
		params?: HttpParams,
		body?: Q,
		handlingOptions?: HandlingOptions,
	): Observable<T> {
		// Default handling options
		handlingOptions = handlingOptions ?? {};
		handlingOptions.showErrorToast = handlingOptions.showErrorToast === undefined ? true : handlingOptions.showErrorToast;
		handlingOptions.showSuccessToast =
			handlingOptions.showSuccessToast === undefined ? false : handlingOptions.showSuccessToast;
		handlingOptions.redirectOnNotAuthenticated =
			handlingOptions.redirectOnNotAuthenticated === undefined ? true : handlingOptions.redirectOnNotAuthenticated;
		handlingOptions.redirectOnUnauthorized =
			handlingOptions.redirectOnUnauthorized === undefined ? true : handlingOptions.redirectOnUnauthorized;
		handlingOptions.successMessage =
			handlingOptions.successMessage === undefined ? "Success" : handlingOptions.successMessage;

		const url = `/api/${endpoint}`;

		const token = this.tokenService.get();
		const headers = {
			"Content-Type": "application/json",
			Accept: "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
		};

		return this.httpClient
			.request<T>(verb, url, { params, body, headers, responseType: "json" })
			.pipe(
				catchError(this.catchErrorHandler.bind(this, handlingOptions)),
				tap(this.catchSuccessHandler.bind(this, handlingOptions)),
			);
	}
}
