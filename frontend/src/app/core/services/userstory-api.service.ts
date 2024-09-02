import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserstoryNewRequest } from "forge-shared/dto/request/userstorynewrequest.dto";
import { UserstoryUpdateRequest } from "forge-shared/dto/request/userstoryupdaterequest.dto";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";
import { UserstorySelfResponse } from "forge-shared/dto/response/userstoryselfresponse.dto";
import { AcceptanceCriteriaNewRequest } from "forge-shared/dto/request/acceptancecriterianewrequest.dto";
import { AcceptanceCriteriaResponse } from "forge-shared/dto/response/acceptancecriteriaresponse.dto";
import { AcceptanceCriteriaSelfResponse } from "forge-shared/dto/response/acceptancecriteriaselfresponse.dto";
import { AcceptanceCriteriaUpdateRequest } from "forge-shared/dto/request/acceptancecriteriaupdaterequest.dto";

@Injectable({
	providedIn: "root",
})
export class UserstoryApiService {
	constructor(private apiService: ApiService) {}

	public newUserstory(userstoryNewRequest: UserstoryNewRequest, projectEid: string): Observable<UserstoryResponse> {
		return this.apiService.call<UserstoryResponse, UserstoryNewRequest>(
			"POST",
			`userstory/${projectEid}/new`,
			undefined,
			userstoryNewRequest,
		);
	}

	public newAcceptanceCriteria(
		acceptanceCriteriaNewRequest: AcceptanceCriteriaNewRequest,
		projectEid: string,
	): Observable<AcceptanceCriteriaResponse> {
		return this.apiService.call<AcceptanceCriteriaResponse, AcceptanceCriteriaNewRequest>(
			"POST",
			`acceptancecriteria/${projectEid}/new`,
			undefined,
			acceptanceCriteriaNewRequest,
		);
	}

	public getAcceptanceCriteria(projectEid: string, userstoryEid: string): Observable<AcceptanceCriteriaSelfResponse> {
		return this.apiService.call<AcceptanceCriteriaSelfResponse>(
			"GET",
			`acceptancecriteria/${projectEid}/${userstoryEid}/self`,
		);
	}

	public updateAcceptanceCriteria(
		projectEid: string,
		acceptanceCriteriaEid: string,
		acceptanceCriteriaUpdateRequest: AcceptanceCriteriaUpdateRequest,
	): Observable<AcceptanceCriteriaResponse> {
		return this.apiService.call<AcceptanceCriteriaResponse, AcceptanceCriteriaUpdateRequest>(
			"PATCH",
			`acceptancecriteria/${projectEid}/${acceptanceCriteriaEid}/update`,
			undefined,
			acceptanceCriteriaUpdateRequest,
		);
	}

	public updateUserstories(
		projectEid: string,
		userstoryEid: string,
		userStoryUpdateRequest: UserstoryUpdateRequest,
	): Observable<UserstoryResponse> {
		return this.apiService.call<UserstoryResponse>(
			"PATCH",
			`userstory/${projectEid}/${userstoryEid}/update`,
			undefined,
			userStoryUpdateRequest,
		);
	}

	public selfBySprint(projectEid: string, sprintEid: string): Observable<UserstorySelfResponse> {
		return this.apiService.call<UserstorySelfResponse>("GET", `userstory/${projectEid}/${sprintEid}/selfbysprint`);
	}

	public get(projectEid: string, userstoryEid: string): Observable<UserstoryResponse> {
		return this.apiService.call<UserstoryResponse>("GET", `userstory/${projectEid}/${userstoryEid}/get`);
	}
}