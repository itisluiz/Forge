import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectSelfResponse } from "forge-shared/dto/response/projectselfresponse.dto";
import { ProjectNewRequest } from "forge-shared/dto/request/projectnewrequest.dto";

@Injectable({
	providedIn: "root",
})
export class ProjectApiService {
	constructor(private apiService: ApiService) {}

	public getProject(): Observable<ProjectSelfResponse> {
		return this.apiService.call<ProjectSelfResponse>("GET", `project/self`);
	}

	public newProject(projectNewRequest: ProjectNewRequest): Observable<ProjectResponse> {
		return this.apiService.call<ProjectResponse, ProjectNewRequest>("POST", `project/new`, undefined, projectNewRequest);
	}
}
