import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { PopupComponent } from "../../popup-component/popup-component";
import { InputComponent } from "../../input-component/input-component";
import { ProjectApiService } from "../../../services/project-api.service";
import { Router } from "@angular/router";
import { ProjectNewRequest } from "forge-shared/dto/request/projectnewrequest.dto";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectSelfResponse } from "forge-shared/dto/response/projectselfresponse.dto";
import { ProjectSelfComposite } from "forge-shared/dto/composite/projectselfcomposite.dto";
import { ProjectMakeInvitationRequest } from "forge-shared/dto/request/projectmakeinvitationrequest.dto";
import { ProjectRole } from "forge-shared/enum/projectrole.enum";
import { ProjectUseInvitationRequest } from "forge-shared/dto/request/projectuseinvitationrequest.dto";
import { MatTabsModule } from "@angular/material/tabs";
import { ProjectUpdateMemberRequest } from "forge-shared/dto/request/projectupdatememberrequest.dto";

@Component({
	selector: "app-select-project-page",
	standalone: true,
	imports: [MatIconModule, CommonModule, MatButtonModule, MatMenuModule, PopupComponent, InputComponent, MatTabsModule],
	templateUrl: "./select-project-page.component.html",
	styleUrl: "./select-project-page.component.scss",
})
export class SelectProjectPageComponent implements OnInit {
	@ViewChild("projectJoin") projectJoin!: InputComponent;

	@ViewChild("projectTitleCreate") projectTitleCreate!: InputComponent;
	@ViewChild("projectDescriptionCreate") projectDescriptionCreate!: InputComponent;
	@ViewChild("projectCodeCreate") projectCodeCreate!: InputComponent;

	@ViewChild("projectInviteUses") projectInviteUses!: InputComponent;
	@ViewChild("projectInviteDuration") projectInviteDuration!: InputComponent;
	@ViewChild("projectInviteRole") projectInviteRole!: InputComponent;

	@ViewChild("memberEid") memberEid!: InputComponent;
	@ViewChild("memberRole") memberRole!: InputComponent;
	@ViewChild("isMemberAdmin") isMemberAdmin!: InputComponent;

	public dataSource!: ProjectSelfComposite[];

	public popUpJoin: boolean = false;
	public popUpCreateProject: boolean = false;
	public popUpInvite: boolean = false;
	public popUpEditMember: boolean = false;

	public editMode: boolean = false;

	public projectName = "";
	public projectId = "";
	public projectInfo!: ProjectResponse;
	public currentMemberId = "";

	public projectCodeError: string = "";
	public projectCreateError: string = "";
	public projectInvitationError: string = "";

	constructor(
		private projectApiService: ProjectApiService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.getProjects();
	}

	createProject(projectNewRequest: ProjectNewRequest) {
		this.projectApiService.newProject(projectNewRequest).subscribe({
			next: (result) => {
				console.log(result);
				this.getProjects();
				this.popUpCreateProject = false;
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	leaveProject(projectId: string) {
		this.projectApiService.leaveProject(projectId).subscribe({
			next: (result) => {
				console.log(result);
				this.getProjects();
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	deleteProject(projectId: string) {
		this.projectApiService.deleteProject(projectId).subscribe({
			next: (result) => {
				console.log("deletado", result);
				this.getProjects();
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	joinProject(projectCode: string) {
		const request: ProjectUseInvitationRequest = {
			code: projectCode,
		};

		this.projectApiService.joinProject(request).subscribe({
			next: (result) => {
				console.log(result);
				this.getProjects();
				this.popUpJoin = false;
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	editProject(projectId: string) {
		this.projectApiService.getEspecificProject(projectId).subscribe({
			next: (response) => {
				this.projectInfo = response;
				console.log('editProject: ',response);
			},
			error: (error) => {
				console.error(error);
			},
		});
		this.editMode = !this.editMode;
	}

	getProjects(): void {
		this.projectApiService.getProjects().subscribe({
			next: (response) => {
				this.updateProjectList(response.projects);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	getEspeficProject(projectId: string): void {
		this.projectApiService.getEspecificProject(projectId).subscribe({
			next: (response) => {
				console.log(response);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	inviteProject(projectId: string, projectMakeInvitationRequest: ProjectMakeInvitationRequest) {
		this.projectApiService.newInvitation(projectId, projectMakeInvitationRequest).subscribe({
			next: (result) => {
				console.log(result.invitation.code);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	updateProjectList(newList: ProjectSelfComposite[]) {
		this.dataSource = newList;
	}

	updateMember(projectId: string, projectUpdateMemberRequest: ProjectUpdateMemberRequest) {
		this.projectApiService.updateMember(projectId, projectUpdateMemberRequest).subscribe({
			next: (result) => {
				console.log(result);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	handleButtonClick(buttonAction: string) {
		if (buttonAction === "join") {
			this.handleJoin();
			return;
		}
		if (buttonAction === "create") {
			this.handleCreateProject();
			return;
		}
		if (buttonAction === "invite") {
			this.handleInviteProject();
			return;
		}
		if (buttonAction === "editMember") {
			this.handleEditMember();
			return;
		}
	}

	handleEditMember() {
		const eidValue = this.memberEid.value;
		const roleValue = Number(this.memberRole.value);
		const adminValue = Boolean(this.isMemberAdmin.value);
	
		if (eidValue && roleValue) {
			const request: ProjectUpdateMemberRequest = {
				eid: eidValue,
				role: roleValue,
				admin: adminValue,
			};
	
			
			this.updateMember(this.projectInfo.eid, request);
		} else {
			// Se algum dos inputs for inválido, atualize a mensagem de erro conforme necessário
			// Lógica adicional para quando algum input é inválido
		}
	}

	handleInviteProject() {
		const usesValue = Number(this.projectInviteUses.value);
		const durationValue = Number(this.projectInviteDuration.value);
		const roleValue: ProjectRole = Number(this.projectInviteRole.value) as ProjectRole;

		if (usesValue && durationValue && roleValue) {
			const request: ProjectMakeInvitationRequest = {
				uses: usesValue,
				durationHours: durationValue,
				role: roleValue,
			};

			this.inviteProject(this.projectId, request);
			this.projectInvitationError = "";
		} else {
			this.projectInvitationError = "Invalid input. Please, check your invitation details and try again.";
		}
	}

	handleCreateProject() {
		const titleValue = this.projectTitleCreate.value;
		const descriptionValue = this.projectDescriptionCreate.value;
		const codeValue = this.projectCodeCreate.value;

		if (titleValue && descriptionValue && codeValue) {
			const request: ProjectNewRequest = {
				title: titleValue,
				description: descriptionValue,
				code: codeValue,
			};

			this.createProject(request);
			this.projectCreateError = "";
		} else {
			// Se algum dos inputs for inválido, atualize a mensagem de erro conforme necessário
			this.projectCreateError = "Invalid input. Please, check your project details and try again.";
			// Lógica adicional para quando algum input é inválido
		}
	}

	handleJoin() {
		const inputValue = this.projectJoin.value;

		if (this.isValidProjectCode(inputValue)) {
			this.joinProject(inputValue);
			this.projectCodeError = "";
		} else {
			this.projectCodeError = "Invalid project code. Please, try again.";
			// Lógica adicional para quando o input é inválido
		}
	}

	openPopUp(popUp: string, projectTitle?: string, projectId?: string, memberEid?: string) {
		if (popUp === "join") {
			this.popUpJoin = true;
			return;
		}
		if (popUp === "create") {
			this.popUpCreateProject = true;
			return;
		}
		if (popUp === "invite") {
			this.popUpInvite = true;
			this.projectName = projectTitle || "";
			this.projectId = projectId || "";
			return;
		}
		if (popUp === "editMember") {
			this.popUpEditMember = true;
			this.currentMemberId = memberEid || "";
			return;
		}
	}

	closePopUp(popUp: string) {
		if (popUp === "join") {
			this.popUpJoin = false;
			this.projectCodeError = "";
			return;
		}

		if (popUp === "create") {
			this.popUpCreateProject = false;
			this.projectCreateError = "";
			return;
		}

		if (popUp === "invite") {
			this.popUpInvite = false;
			return;
		}

		if (popUp === "editMember") {
			this.popUpEditMember = false;
			return;
		}
	}

	isValidProjectTitle(title: string): boolean {
		return title.length >= 3 && title.length <= 100;
	}

	isValidProjectDescription(description: string): boolean {
		return description.length >= 10 && description.length <= 500;
	}

	isValidProjectCode(code: string): boolean {
		return code.length > 1;
	}
}
