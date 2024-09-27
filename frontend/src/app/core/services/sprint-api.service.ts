import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EpicSelfResponse } from "forge-shared/dto/response/epicselfresponse.dto";
import { SprintResponse } from "forge-shared/dto/response/sprintresponse.dto";
import { SprintNewRequest } from "forge-shared/dto/request/sprintnewrequest.dto";
import { SprintUpdateRequest } from "forge-shared/dto/request/sprintupdaterequest.dto";
import { SprintSelfResponse } from "forge-shared/dto/response/sprintselfresponse.dto";
import { BurndownResponse } from "forge-shared/dto/response/burndownresponse.dto";

@Injectable({
	providedIn: "root",
})
export class SprintApiService {
	constructor(private apiService: ApiService) {}

	public newSprint(sprintNewRequest: SprintNewRequest, projectEid: string): Observable<SprintResponse> {
		return this.apiService.call<SprintResponse, SprintNewRequest>(
			"POST",
			`sprint/${projectEid}/new`,
			undefined,
			sprintNewRequest,
		);
	}

	public updateSprint(
		sprintUpdateRequest: SprintUpdateRequest,
		projectEid: string,
		sprintEid: string,
	): Observable<SprintResponse> {
		return this.apiService.call<SprintResponse, SprintUpdateRequest>(
			"PATCH",
			`sprint/${projectEid}/${sprintEid}/update`,
			undefined,
			sprintUpdateRequest,
		);
	}

	public self(projectEid: string): Observable<SprintSelfResponse> {
		return this.apiService.call<SprintSelfResponse>("GET", `sprint/${projectEid}/self`);
	}

	public getSprint(projectEid: string, sprintEid: string): Observable<SprintResponse> {
		return this.apiService.call<SprintResponse>("GET", `sprint/${projectEid}/${sprintEid}/get`);
	}

	public deleteSprint(projectEid: string, sprintEid: string): Observable<void> {
		return this.apiService.call<void>("DELETE", `sprint/${projectEid}/${sprintEid}/delete`);
	}

	public getBurndownData(projectEid: string, sprintEid: string): Observable<BurndownResponse> {
		return this.apiService.call<BurndownResponse>("GET", `sprint/${projectEid}/${sprintEid}/burndown`);
	}
}
