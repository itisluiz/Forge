import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TaskUpdateRequest } from "forge-shared/dto/request/taskupdaterequest.dto";
import { TaskSelfResponse } from "forge-shared/dto/response/taskselfresponse.dto";
import { TaskNewRequest } from "forge-shared/dto/request/tasknewrequest.dto";
import { TaskResponse } from "forge-shared/dto/response/taskresponse.dto";

@Injectable({
	providedIn: "root",
})
export class TaskApiService {
	constructor(private apiService: ApiService) {}

	public getTasks(projectEid: string, userStoryEid: string): Observable<TaskSelfResponse> {
		return this.apiService.call<TaskSelfResponse>("GET", `task/${projectEid}/${userStoryEid}/self`);
	}

	public newTask(taskNewRequest: TaskNewRequest, projectEid: string): Observable<TaskResponse> {
		return this.apiService.call<TaskResponse, TaskNewRequest>("POST", `task/${projectEid}/new`, undefined, taskNewRequest);
	}

	public updateTask(taskUpdateRequest: TaskUpdateRequest, projectEid: string, taskEid: string): Observable<TaskResponse> {
		return this.apiService.call<TaskResponse, TaskUpdateRequest>(
			"PATCH",
			`task/${projectEid}/${taskEid}/update`,
			undefined,
			taskUpdateRequest,
		);
	}

	public getTask(projectEid: string, taskEid: string): Observable<TaskResponse> {
		return this.apiService.call<TaskResponse>("GET", `task/${projectEid}/${taskEid}/get`);
	}
}
