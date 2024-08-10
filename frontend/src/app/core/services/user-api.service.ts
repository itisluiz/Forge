import { ApiService } from "./api.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenService } from "./token.service";
import { UserSelfResponse } from "forge-shared/dto/response/userselfresponse.dto";
import { UserSigninRequest } from "forge-shared/dto/request/usersigninrequest.dto";
import { UserSigninResponse } from "forge-shared/dto/response/usersigninresponse.dto";
import { UserSignupRequest } from "forge-shared/dto/request/usersignuprequest.dto";

@Injectable({
	providedIn: "root",
})
export class UserApiService {
	constructor(
		private apiService: ApiService,
		private tokenService: TokenService,
	) {}

	private setTokenFromSigninResponse(signinResponseObservable: Observable<UserSigninResponse>): void {
		signinResponseObservable.subscribe({
			next: (response) => this.tokenService.set(response.token),
			error: (error: HttpErrorResponse) => {},
		});
	}

	public signup(userSignupRequest: UserSignupRequest): Observable<UserSigninResponse> {
		const result = this.apiService.call<UserSigninResponse, UserSignupRequest>(
			"POST",
			"user/signup",
			undefined,
			userSignupRequest,
		);
		this.setTokenFromSigninResponse(result);
		return result;
	}

	public signin(userSigninRequest: UserSigninRequest): Observable<UserSigninResponse> {
		const result = this.apiService.call<UserSigninResponse, UserSigninRequest>(
			"POST",
			"user/signin",
			undefined,
			userSigninRequest,
		);
		this.setTokenFromSigninResponse(result);
		return result;
	}

	public self(): Observable<UserSelfResponse> {
		return this.apiService.call<UserSelfResponse>("GET", "user/self");
	}
}
