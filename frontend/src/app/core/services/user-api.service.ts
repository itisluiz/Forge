import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { map, Observable, switchMap, tap } from "rxjs";
import { TokenService } from "./token.service";
import { UserSelfResponse } from "forge-shared/dto/response/userselfresponse.dto";
import { UserSigninRequest } from "forge-shared/dto/request/usersigninrequest.dto";
import { UserSigninResponse } from "forge-shared/dto/response/usersigninresponse.dto";
import { UserSignupRequest } from "forge-shared/dto/request/usersignuprequest.dto";
import { ProjectApiService } from "./project-api.service";
import { ProjectRole } from "forge-shared/enum/projectrole.enum";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";

@Injectable({
	providedIn: "root",
})
export class UserApiService {
	constructor(
		private apiService: ApiService,
		private tokenService: TokenService,
		private projectApiService: ProjectApiService,
	) {}

	private setTokenFromSigninResponse(userSigninResponse: UserSigninResponse) {
		this.tokenService.set(userSigninResponse.token);
	}

	public signup(userSignupRequest: UserSignupRequest): Observable<UserSigninResponse> {
		return this.apiService
			.call<UserSigninResponse, UserSignupRequest>("POST", "user/signup", undefined, userSignupRequest)
			.pipe(
				tap((userSigninResponse) => {
					this.setTokenFromSigninResponse(userSigninResponse);
				}),
			);
	}

	public signin(userSigninRequest: UserSigninRequest): Observable<UserSigninResponse> {
		return this.apiService
			.call<UserSigninResponse, UserSigninRequest>("POST", "user/signin", undefined, userSigninRequest)
			.pipe(
				tap((userSigninResponse) => {
					this.setTokenFromSigninResponse(userSigninResponse);
				}),
			);
	}

	public self(): Observable<UserSelfResponse> {
		return this.apiService.call<UserSelfResponse>("GET", "user/self");
	}

	public membership(projectEid: string): Observable<ProjectMemberComposite | undefined> {
		return this.self().pipe(
			switchMap((user) =>
				this.projectApiService.getEspecificProject(projectEid).pipe(
					map((project) => {
						return project.members.find((member) => member.eid === user.eid);
					}),
				),
			),
		);
	}
}
