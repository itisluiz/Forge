import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectSelfResponse } from "forge-shared/dto/response/projectselfresponse.dto";
import { ProjectInvitationsResponse } from "forge-shared/dto/response/projectinvitationsresponse.dto";
import { ProjectMakeInvitationResponse } from "forge-shared/dto/response/projectmakeinvitationresponse.dto";
import { ProjectNewRequest } from "forge-shared/dto/request/projectnewrequest.dto";
import { ProjectMakeInvitationRequest } from "forge-shared/dto/request/projectmakeinvitationrequest.dto";
import { ProjectUseInvitationRequest } from "forge-shared/dto/request/projectuseinvitationrequest.dto";
import { ProjectUpdateMemberRequest } from "forge-shared/dto/request/projectupdatememberrequest.dto";
import { ProjectUpdateRequest } from "forge-shared/dto/request/projectupdaterequest.dto";
import { ProjectKickRequest } from "forge-shared/dto/request/projectkickrequest.dto";
import { FailureResponse } from "forge-shared/dto/response/failureresponse.dto";

@Injectable({
	providedIn: "root",
})
export class ProjectApiService {
	constructor(private apiService: ApiService) {}

	public self(): Observable<ProjectSelfResponse> {
		return this.apiService.call<ProjectSelfResponse>("GET", "project/self");
	}

	public getProjects(): Observable<ProjectSelfResponse> {
		return this.apiService.call<ProjectSelfResponse>("GET", `project/self`);
	}

	public getEspecificProject(projectId: string): Observable<ProjectResponse> {
		return this.apiService.call<ProjectResponse>("GET", `project/${projectId}/get`);
	}

	public newProject(projectNewRequest: ProjectNewRequest): Observable<ProjectResponse> {
		return this.apiService.call<ProjectResponse, ProjectNewRequest>("POST", `project/new`, undefined, projectNewRequest);
	}

	public updateProject(projectId: string, projectUpdateRequest: ProjectUpdateRequest): Observable<ProjectResponse> {
		return this.apiService.call<ProjectResponse, ProjectUpdateRequest>(
			"PATCH",
			`project/${projectId}/update`,
			undefined,
			projectUpdateRequest,
		);
	}

	public newInvitation(
		projectId: string,
		projectMakeInvitationRequest: ProjectMakeInvitationRequest,
	): Observable<ProjectMakeInvitationResponse> {
		return this.apiService.call<ProjectMakeInvitationResponse, ProjectMakeInvitationRequest>(
			"POST",
			`project/${projectId}/makeinvitation`,
			undefined,
			projectMakeInvitationRequest,
		);
	}

	public joinProject(projectId: ProjectUseInvitationRequest): Observable<ProjectInvitationsResponse> {
		return this.apiService.call<ProjectInvitationsResponse, ProjectUseInvitationRequest>(
			"POST",
			`project/useinvitation`,
			undefined,
			projectId,
		);
	}

	public leaveProject(projectId: string): Observable<void> {
		return this.apiService.call<void>("POST", `project/${projectId}/leave`);
	}

	public deleteProject(projectId: string): Observable<void> {
		return this.apiService.call<void>("DELETE", `project/${projectId}`);
	}

	public updateMember(projectId: string, request: ProjectUpdateMemberRequest): Observable<void> {
		return this.apiService.call<void>("PATCH", `project/${projectId}/updatemember`, undefined, request);
	}

	public removeMember(projectId: string, memberEid: ProjectKickRequest): Observable<ProjectResponse> {
		return this.apiService.call<ProjectResponse, ProjectKickRequest>(
			"POST",
			`project/${projectId}/kick`,
			undefined,
			memberEid,
		);
	}
}
