import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AcceptanceCriteriaResponse } from "forge-shared/dto/response/acceptancecriteriaresponse.dto";
import { AcceptanceCriteriaSelfResponse } from "forge-shared/dto/response/acceptancecriteriaselfresponse.dto";
import { AcceptanceCriteriaUpdateRequest } from "forge-shared/dto/request/acceptancecriteriaupdaterequest.dto";
import { AcceptanceCriteriaNewRequest } from "forge-shared/dto/request/acceptancecriterianewrequest.dto";

@Injectable({
	providedIn: "root",
})
export class AcceptanceCriteriaService {
	constructor(private apiService: ApiService) {}

	public createAcceptanceCriteria(
		acceptanceCriteriaRequest: AcceptanceCriteriaNewRequest,
		projectEid: string,
	): Observable<AcceptanceCriteriaResponse> {
		return this.apiService.call<AcceptanceCriteriaResponse, AcceptanceCriteriaNewRequest>(
			"POST",
			`acceptancecriteria/${projectEid}/new`,
			undefined,
			acceptanceCriteriaRequest,
		);
	}

	public updateAcceptanceCriteria(
		acceptanceCriteriaRequest: AcceptanceCriteriaUpdateRequest,
		projectEid: string,
		acceptanceCriteriaEid: string,
	): Observable<AcceptanceCriteriaResponse> {
		return this.apiService.call<AcceptanceCriteriaResponse, AcceptanceCriteriaUpdateRequest>(
			"PATCH",
			`acceptancecriteria/${projectEid}/${acceptanceCriteriaEid}/update`,
			undefined,
			acceptanceCriteriaRequest,
		);
	}

	public getAllAcceptanceCriteria(projectEid: string, userStoryEid: string): Observable<AcceptanceCriteriaSelfResponse> {
		return this.apiService.call<AcceptanceCriteriaSelfResponse>(
			"GET",
			`acceptancecriteria/${projectEid}/${userStoryEid}/self`,
		);
	}

	public getEspcificAcceptanceCriteria(
		projectEid: string,
		acceptanceCriteriaEid: string,
	): Observable<AcceptanceCriteriaResponse> {
		return this.apiService.call<AcceptanceCriteriaResponse>(
			"GET",
			`acceptancecriteria/${projectEid}/${acceptanceCriteriaEid}/get`,
		);
	}

	public deleteAcceptanceCriteria(projectEid: string, acceptanceCriteriaEid: string): Observable<void> {
		return this.apiService.call<void>("DELETE", `acceptancecriteria/${projectEid}/${acceptanceCriteriaEid}/delete`);
	}
}
