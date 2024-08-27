import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EpicSelfResponse } from "forge-shared/dto/response/epicselfresponse.dto";
import { EpicResponse } from "forge-shared/dto/response/epicresponse.dto";
import { EpicNewRequest } from "forge-shared/dto/request/epicnewrequest.dto";
import { EpicUpdateRequest } from "forge-shared/dto/request/epicupdaterequest.dto";

@Injectable({
	providedIn: "root",
})
export class EpicApiService {
	constructor(private apiService: ApiService) {}

	public getEpics(projectEid: string): Observable<EpicSelfResponse> {
		return this.apiService.call<EpicSelfResponse>("GET", `epic/${projectEid}/self`);
	}

	public newEpic(epicNewRequest: EpicNewRequest, projectEid: string): Observable<EpicResponse> {
		return this.apiService.call<EpicResponse, EpicNewRequest>("POST", `epic/${projectEid}/new`, undefined, epicNewRequest);
	}

	public getEpic(projectEid: string, epicEid: string): Observable<EpicResponse> {
		return this.apiService.call<EpicResponse>("GET", `epic/${projectEid}/${epicEid}/get`);
	}

	public updateEpic(epicUpdateRequest: EpicUpdateRequest, projectEid: string, epicEid: string): Observable<EpicResponse> {
		return this.apiService.call<EpicResponse, EpicUpdateRequest>(
			"PATCH",
			`epic/${projectEid}/${epicEid}/update`,
			undefined,
			epicUpdateRequest,
		);
	}

	public deleteEpic(epicEid: string, projectEid: string): Observable<EpicResponse> {
		return this.apiService.call<EpicResponse>("DELETE", `epic/${projectEid}/${epicEid}/delete`);
	}
}
