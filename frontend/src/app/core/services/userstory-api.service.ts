import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserstoryNewRequest } from "forge-shared/dto/request/userstorynewrequest.dto";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";
import { AcceptanceCriteriaNewRequest } from "forge-shared/dto/request/acceptancecriterianewrequest.dto";
import { AcceptanceCriteriaResponse } from "forge-shared/dto/response/acceptancecriteriaresponse.dto";

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
}
