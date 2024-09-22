import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
import { UserApiService } from "../../../services/user-api.service";
import { ProjectUpdateRequest } from "forge-shared/dto/request/projectupdaterequest.dto";
import { ProjectKickRequest } from "forge-shared/dto/request/projectkickrequest.dto";
import { SelectComponent } from "../../select-component/select-component";
import { DeletePopupComponent } from "../../delete-popup/delete-popup.component";
import { ProjectRolePipe } from "../../../pipes/project-role.pipe";
import { MatRippleModule } from "@angular/material/core";

@Component({
	selector: "app-select-project-page",
	standalone: true,
	imports: [
		MatIconModule,
		CommonModule,
		MatButtonModule,
		MatMenuModule,
		PopupComponent,
		InputComponent,
		MatTabsModule,
		SelectComponent,
		DeletePopupComponent,
		ProjectRolePipe,
		MatRippleModule,
	],
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

	@ViewChild("updateProjectCode") updateProjectCode!: InputComponent;
	@ViewChild("updateProjectName") updateProjectName!: InputComponent;
	@ViewChild("updateProjectDescription") updateProjectDescription!: InputComponent;

	@ViewChild("memberEid") memberEid!: InputComponent;
	@ViewChild("memberRole") memberRole!: SelectComponent;
	@ViewChild("isMemberAdmin") isMemberAdmin!: SelectComponent;

	@ViewChild("popupCreateProjectRef") popupCreateProjectRef!: PopupComponent;
	@ViewChild("popupUpdateMemberRef") popupUpdateMemberRef!: PopupComponent;
	@ViewChild("popupJoinRef") popupJoinRef!: PopupComponent;

	public dataSource!: ProjectSelfComposite[];
	public completedDataSource: any[] = [];

	public popUpJoin: boolean = false;
	public popUpCreateProject: boolean = false;
	public popUpInvite: boolean = false;
	public popUpEditMember: boolean = false;
	public popUpInviteResult: boolean = false;
	public popUpDeleteProject: boolean = false;
	public popUpLeaveProject: boolean = false;

	public editMode: boolean = false;
	public noProjects: boolean = false;

	public buttonEditProject: boolean = false;

	public selectedProjectId: string | null = null;
	public projectName = "";
	public projectId = "";
	public projectInfo!: ProjectResponse;

	public currentMemberId: string = "";
	public currentIsAdmin: boolean = false;

	public invitationResult = "";

	public projectCodeError: string = "";
	public projectCreateError: string = "";
	public projectInvitationError: string = "";
	public projectEditMemberError: string = "";
	public projectUpdateError: string = "";

	public validProjectUpdateForm = true;
	public validProjectJoinForm = false;
	public loadingSaveProjectUpdate = false;
	public loadingMakeInvite = false;

	constructor(
		private projectApiService: ProjectApiService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.getProjects();
		const urlParams = new URLSearchParams(window.location.search);

		const inviteCode = urlParams.get("inviteCode");
		if (inviteCode && inviteCode.length === 24) {
			console.log("Invite Code:", inviteCode);
			urlParams.delete("inviteCode");
			window.history.replaceState({}, "", window.location.pathname);

			this.joinProject(inviteCode);
		}
	}

	selectProject(projectId: string) {
		this.selectedProjectId = projectId;
	}

	revalidateProjectUpdateForm() {
		const valid = this.updateProjectCode.valid && this.updateProjectName.valid && this.updateProjectDescription.valid;
		this.validProjectUpdateForm = valid;
	}

	revalidateProjectJoinForm() {
		const valid = this.projectJoin.valid;
		this.validProjectJoinForm = valid;
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
				this.popUpLeaveProject = false;
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
				this.popUpDeleteProject = false;
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
				this.popupJoinRef.loading = false;
				this.popUpJoin = false;
			},
			error: (error) => {
				this.popupJoinRef.loading = false;
				console.error(error);
			},
		});
	}

	editProject(projectId: string) {
		this.projectApiService.getEspecificProject(projectId).subscribe({
			next: (response) => {
				this.projectInfo = response;
				console.log("editProject: ", response);
			},
			error: (error) => {
				console.log("editProject deu ruim");
				console.error(error);
			},
		});
		this.editMode = !this.editMode;
	}

	updateProject(projectId: string) {
		this.loadingSaveProjectUpdate = true;
		const request: ProjectUpdateRequest = {
			code: this.updateProjectCode.value,
			title: this.updateProjectName.value,
			description: this.updateProjectDescription.value,
		};

		if (request.code!.length !== 3 && request.title!.length && request.description!.length) {
			this.projectUpdateError = "Invalid input. Please, check your project details and try again.";
			return;
		}

		this.projectApiService.updateProject(projectId, request).subscribe({
			next: (result) => {
				console.log("updateProject(): ", result);
				this.projectUpdateError = "";
				this.getProjects();
				this.loadingSaveProjectUpdate = false;
				this.editMode = false;
			},
			error: (error) => {
				console.error(error);
				this.loadingSaveProjectUpdate = false;
				this.projectUpdateError = "Invalid input. Please, check your project details and try again.";
			},
		});
	}

	getProjects(): void {
		this.projectApiService.getProjects().subscribe({
			next: (response) => {
				this.updateProjectList(response.projects);
				if (response.projects.length === 0) {
					this.noProjects = true;
				} else {
					this.noProjects = false;
				}
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	selfProject(): void {
		this.projectApiService.self().subscribe({
			next: (response) => {
				console.log(response);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	getEspeficProject(projectId: string): void {
		this.projectApiService.getEspecificProject(projectId).subscribe({
			next: (response) => {
				this.projectInfo = response;
				this.completedDataSource.push(response);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	inviteProject(projectId: string, projectMakeInvitationRequest: ProjectMakeInvitationRequest) {
		this.projectApiService.newInvitation(projectId, projectMakeInvitationRequest).subscribe({
			next: (result) => {
				this.invitationResult = result.invitation.code;
				this.popUpInviteResult = true;
				this.popUpInvite = false;
				this.loadingMakeInvite = false;
			},
			error: (error) => {
				console.error(error);
				this.loadingMakeInvite = false;
			},
		});
	}

	checkDataSource(dataSource: any) {
		if (dataSource.length > 3) {
			return "extend";
		}
		return "";
	}

	findProjectOwner(project: ProjectResponse) {
		return project.members.find((member) => member.admin && member.role === 1)?.name;
	}

	updateAllProjectDetails() {
		this.completedDataSource = [];
		this.dataSource.forEach((project) => {
			this.getEspeficProject(project.eid);
		});
		console.log("completedDataSource: ", this.completedDataSource);
	}

	updateProjectList(newList: ProjectSelfComposite[]) {
		this.dataSource = newList;
		this.updateAllProjectDetails();
	}

	updateMember(projectId: string, projectUpdateMemberRequest: ProjectUpdateMemberRequest) {
		this.projectApiService.updateMember(projectId, projectUpdateMemberRequest).subscribe({
			next: (result) => {
				console.log(result);
				this.popupUpdateMemberRef.loading = false;
				this.popUpEditMember = false;
				this.getEspeficProject(projectId);
			},
			error: (error) => {
				console.error(error);
				this.popupUpdateMemberRef.loading = false;
			},
		});
	}

	removeMember(projectId: string, memberEid: string) {
		const memberResquest: ProjectKickRequest = {
			eid: memberEid,
		};

		this.projectApiService.removeMember(projectId, memberResquest).subscribe({
			next: (result) => {
				console.log(result);
				this.getEspeficProject(projectId);
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
		const roleValue = this.memberRole.valueRaw !== null ? Number(this.memberRole.valueRaw) : undefined;
		const adminValue = this.isMemberAdmin.valueRaw === null ? undefined : this.isMemberAdmin.valueRaw === "true";

		const request: ProjectUpdateMemberRequest = {
			eid: eidValue,
			role: roleValue,
			admin: adminValue,
		};

		this.popupUpdateMemberRef.loading = true;
		this.updateMember(this.projectInfo.eid, request);
	}

	handleInviteProject() {
		const usesValue = Math.floor(Number(this.projectInviteUses.value));
		const durationValue = Number(this.projectInviteDuration.value);
		const roleValue = Number(this.projectInviteRole.value) as ProjectRole;

		if (usesValue && durationValue && roleValue) {
			this.loadingMakeInvite = true;
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

	revalidateProjectCreateForm() {
		const valid = this.projectTitleCreate.valid && this.projectDescriptionCreate.valid && this.projectCodeCreate.valid;
		this.popupCreateProjectRef.buttonEnabled = valid;
	}

	handleCreateProject() {
		this.popupCreateProjectRef.loading = true;
		const title = this.projectTitleCreate;
		const description = this.projectDescriptionCreate;
		const code = this.projectCodeCreate;

		if (title.valid && description.valid && code.valid) {
			const request: ProjectNewRequest = {
				title: title.value,
				description: description.value,
				code: code.value,
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
			this.popupJoinRef.loading = true;
			this.joinProject(inputValue);
			this.projectCodeError = "";
		} else {
			this.projectCodeError = "Invalid project code. Please, try again.";
			// Lógica adicional para quando o input é inválido
		}
	}

	openPopUp(popUp: string, projectTitle?: string, projectId?: string, memberEid?: string, isMemberAdmin?: boolean) {
		if (popUp === "join") {
			this.validProjectJoinForm = false;
			this.popUpJoin = true;
			console.log("Opening join pop-up, popUpJoin:", this.popUpJoin);
			return;
		}
		if (popUp === "create") {
			this.popUpCreateProject = true;
			console.log("Opening create project pop-up, popUpCreateProject:", this.popUpCreateProject);
			return;
		}
		if (popUp === "invite") {
			this.popUpInvite = true;
			this.projectName = projectTitle || "";
			this.projectId = projectId || "";
			console.log(
				"Opening invite pop-up, popUpInvite:",
				this.popUpInvite,
				"projectName:",
				this.projectName,
				"projectId:",
				this.projectId,
			);
			return;
		}
		if (popUp === "editMember") {
			this.popUpEditMember = true;
			this.currentMemberId = memberEid || "";
			this.currentIsAdmin = isMemberAdmin || false;
			console.log(
				"Opening edit member pop-up, popUpEditMember:",
				this.popUpEditMember,
				"currentMemberId:",
				this.currentMemberId,
			);
			return;
		}
		if (popUp === "deleteConfirm") {
			this.popUpDeleteProject = true;
			this.projectId = projectId || "";
			console.log(
				"Opening delete project pop-up, popUpDeleteProject:",
				this.popUpDeleteProject,
				"projectName:",
				this.projectName,
				"projectId:",
				this.projectId,
			);
			return;
		}
		if (popUp === "leaveConfirm") {
			this.popUpLeaveProject = true;
			this.projectId = projectId || "";
			console.log(
				"Opening leave project pop-up, popUpLeaveProject:",
				this.popUpLeaveProject,
				"projectName:",
				this.projectName,
				"projectId:",
				this.projectId,
			);
		}
	}

	closePopUp(popUp: string) {
		if (popUp === "join") {
			this.popUpJoin = false;
			console.log("Closing join pop-up, popUpJoin:", this.popUpJoin);
			return;
		}
		if (popUp === "create") {
			this.popUpCreateProject = false;
			console.log("Closing create project pop-up, popUpCreateProject:", this.popUpCreateProject);
			return;
		}
		if (popUp === "invite") {
			this.popUpInvite = false;
			console.log("Closing invite pop-up, popUpInvite:", this.popUpInvite);
			return;
		}
		if (popUp === "editMember") {
			this.popUpEditMember = false;
			this.projectEditMemberError = "";
			console.log("Closing edit member pop-up, popUpEditMember:", this.popUpEditMember);
			return;
		}
		if (popUp === "inviteResult") {
			this.popUpInviteResult = false;
			console.log("Closing invite result pop-up, popUpInviteResult:", this.popUpInviteResult);
			return;
		}
		if (popUp === "deleteConfirm") {
			this.popUpDeleteProject = false;
			console.log("Closing delete project pop-up, popUpDeleteProject:", this.popUpDeleteProject);
			return;
		}
		if (popUp === "leaveConfirm") {
			this.popUpLeaveProject = false;
			console.log("Closing leave project pop-up, popUpLeaveProject:", this.popUpLeaveProject);
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

	navigateTo(route: string) {
		this.router.navigate([route]);
	}

	makeInvitationUrl(invitationCode: string): string {
		return window.location.origin + `/select-project?inviteCode=${invitationCode}`;
	}

	copyToClipboard(value: string) {
		navigator.clipboard
			.writeText(value)
			.then(() => {
				console.log("Copied to clipboard:", value);
			})
			.catch((err) => {
				console.error("Failed to copy:", err);
			});
	}

	get enableNextButton(): boolean {
		if (this.selectedProjectId === null) {
			return true;
		}
		if (this.dataSource.length < 1) {
			return true;
		}
		return false;
	}
}
