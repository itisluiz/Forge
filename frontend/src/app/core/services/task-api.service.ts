import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TaskSelfResponse } from "forge-shared/dto/response/taskselfresponse.dto";

@Injectable({
	providedIn: "root",
})
export class TaskApiService {
	constructor(private apiService: ApiService) {}

	public getTasks(projectEid: string, userStoryEid: string): Observable<TaskSelfResponse> {
		return this.apiService.call<TaskSelfResponse>("GET", `task/${projectEid}/${userStoryEid}/self`);
	}

	public task(projectEid: string, userStoryEid: string): Observable<TaskSelfResponse> {
		return this.apiService.call<TaskSelfResponse>("GET", `task/${projectEid}/${userStoryEid}/get`);
	}
}
