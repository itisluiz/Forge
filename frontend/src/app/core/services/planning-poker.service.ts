import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PlanningpokerResponse } from "forge-shared/dto/response/planningpokerresponse.dto";
import { PlanningpokerSelfResponse } from "forge-shared/dto/response/planningpokerselfresponse.dto";
import { PlanningpokerSettaskRequest } from "forge-shared/dto/request/planningpokersettaskrequest.dto";
import { PlanningpokerCreatesessionRequest } from "forge-shared/dto/request/planningpokercreatesessionrequest.dto";
import { PlanningpokerVoteRequest } from "forge-shared/dto/request/planningpokervoterequest.dto";
import { PlanningpokerCreatesessionResponse } from "forge-shared/dto/response/planningpokercreatesessionresponse.dto";

@Injectable({
	providedIn: "root",
})
export class PlanningPokerService {
	constructor(private apiService: ApiService) {}

	public createSession(
		createRequest: PlanningpokerCreatesessionRequest,
		projectEid: string,
	): Observable<PlanningpokerCreatesessionResponse> {
		return this.apiService.call<PlanningpokerCreatesessionResponse, PlanningpokerCreatesessionRequest>(
			"POST",
			`planningpoker/${projectEid}/createsession`,
			undefined,
			createRequest,
		);
	}

	// public setTask(setTaskRequest: PlanningpokerSettaskRequest, projectEid: string): Observable<void> {
	// 	return this.apiService.call<void, PlanningpokerSettaskRequest>(
	// 		"POST",
	// 		`planningpoker/${projectEid}/settask`,
	// 		undefined,
	// 		setTaskRequest,
	// 	);
	// }

	// public revealVotes(projectEid: string, sessionCode: string): Observable<void> {
	// 	return this.apiService.call<void>("POST", `planningpoker/${projectEid}/${sessionCode}/revealvotes`);
	// }

	// public saveResult(voteRequest: PlanningpokerVoteRequest, projectEid: string, sessionCode: string): Observable<void> {
	// 	return this.apiService.call<void, PlanningpokerVoteRequest>(
	// 		"POST",
	// 		`planningpoker/${projectEid}/${sessionCode}/saveresult`,
	// 		undefined,
	// 		voteRequest,
	// 	);
	// }

	// public setVote(voteRequest: PlanningpokerVoteRequest, projectEid: string, sessionCode: string): Observable<void> {
	// 	return this.apiService.call<void, PlanningpokerVoteRequest>(
	// 		"POST",
	// 		`planningpoker/${projectEid}/${sessionCode}/vote`,
	// 		undefined,
	// 		voteRequest,
	// 	);
	// }

	public getSessions(projectEid: string): Observable<PlanningpokerSelfResponse> {
		return this.apiService.call<PlanningpokerSelfResponse>("GET", `planningpoker/${projectEid}/sessions`);
	}

	public pullSession(projectEid: string, sessionCode: string): Observable<PlanningpokerResponse> {
		return this.apiService.call<PlanningpokerResponse>("GET", `planningpoker/${projectEid}/${sessionCode}`);
	}
}
