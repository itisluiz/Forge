import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserstoryNewRequest } from "forge-shared/dto/request/userstorynewrequest.dto";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";

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
}
