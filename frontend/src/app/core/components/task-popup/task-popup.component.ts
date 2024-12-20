import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";
import { Observable } from "rxjs";
import { UserstoryUpdateRequest } from "forge-shared/dto/request/userstoryupdaterequest.dto";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { TaskNewRequest } from "forge-shared/dto/request/tasknewrequest.dto";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum";
import { TaskResponse } from "forge-shared/dto/response/taskresponse.dto";
import { TaskApiService } from "../../services/task-api.service";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectApiService } from "../../services/project-api.service";
import { TaskUpdateRequest } from "forge-shared/dto/request/taskupdaterequest.dto";
import { UserstoryApiService } from "../../services/userstory-api.service";
import { MatSliderModule } from "@angular/material/slider";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { UserPermsService } from "../../services/user-perms.service";
import { ProjectRole } from "forge-shared/enum/projectrole.enum";

@Component({
	selector: "app-task-popup",
	standalone: true,
	imports: [
		CommonModule,
		MatIcon,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatStepperModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSliderModule,
		MatProgressBarModule,
	],
	templateUrl: "./task-popup.component.html",
	styleUrl: "./task-popup.component.scss",
})
export class TaskPopupComponent implements OnInit, OnDestroy {
	@Input() isEditMode: boolean = false;
	@Input() projectEid: string = "";
	@Input() userStoryEid: string = "";
	@Input() taskEditData!: TaskResponse;
	@Input() userMembership?: ProjectMemberComposite;
	@Output() closePopUpEmitter = new EventEmitter<void>();
	@Output() handleTaskAndClosePopupEmitter: EventEmitter<TaskResponse> = new EventEmitter();
	@Output() handleEditedTaskAndClosePopupEmitter: EventEmitter<void> = new EventEmitter();
	userStory: UserstoryResponse | null = null;
	popUpActive: boolean = false;
	taskForm!: FormGroup;
	creationFailed: boolean = false;
	formSubmitted: boolean = false;
	projectMembersMap: Record<string, ProjectMemberComposite> = {};
	projectMembers: ProjectMemberComposite[] = [];
	maxComplexity: number = 0;
	disableButtonDuringRequest: boolean = false;

	public checkUserPerms(allowedRoles: ProjectRole[]) {
		return this.userPermsService.checkUserPerms(this.userMembership, allowedRoles);
	}

	constructor(
		private formBuilder: FormBuilder,
		private taskApiService: TaskApiService,
		private projectApiService: ProjectApiService,
		private userstoryApiService: UserstoryApiService,
		private userPermsService: UserPermsService,
	) {}

	ngOnInit(): void {
		this.loadUserStory();
		this.getProject().subscribe((project) => {
			this.projectMembers = project.members;
		});
		this.taskForm = this.formBuilder.group({
			title: ["", [Validators.required, Validators.minLength(3)]],
			responsible: [null],
			description: ["", [Validators.required, Validators.minLength(3)]],
			type: ["", Validators.required],
			priority: ["", Validators.required],
			complexity: [],
		});
		if (this.isEditMode) {
			this.taskForm.patchValue({
				title: this.taskEditData.title,
				responsible: this.taskEditData.responsibleEid,
				description: this.taskEditData.description,
				type: this.taskEditData.type.toString(),
				priority: this.taskEditData.priority.toString(),
				complexity: this.taskEditData.complexity,
			});
		}
	}

	getProject(): Observable<ProjectResponse> {
		return this.projectApiService.getEspecificProject(this.projectEid);
	}

	ngOnDestroy(): void {}

	closePopUp() {
		this.taskForm.reset();
		this.closePopUpEmitter.emit();
	}

	loadUserStory() {
		const userStoryEid = this.taskEditData?.userstoryEid || this.userStoryEid;
		if (userStoryEid) {
			this.userstoryApiService.get(this.projectEid, userStoryEid).subscribe((userStory) => {
				this.userStory = userStory;
				this.maxComplexity = (userStory.freeEffortScore ?? 0) + (this.taskEditData?.complexity ?? 0);
			});
		}
	}

	submitTaskForm() {
		this.disableButtonDuringRequest = true;
		this.formSubmitted = true;

		if (this.taskForm.valid) {
			if (!this.isEditMode) {
				const taskNewRequest = this.buildTaskNewRequest();
				this.createTask(taskNewRequest);
			} else {
				const taskUpdateRequest = this.buildTaskUpdateRequest();
				this.updateTask(taskUpdateRequest);
			}
		}
	}

	private buildTaskNewRequest(): TaskNewRequest {
		const responsibleEid = this.taskForm.get("responsible")?.value;

		return {
			userstoryEid: this.userStoryEid,
			responsibleEid: responsibleEid === "null" ? null : responsibleEid,
			title: this.taskForm.get("title")?.value,
			description: this.taskForm.get("description")?.value,
			type: parseInt(this.taskForm.get("type")?.value),
			priority: parseInt(this.taskForm.get("priority")?.value),
		};
	}

	private buildTaskUpdateRequest(): TaskUpdateRequest {
		const responsibleEid = this.taskForm.get("responsible")?.value;

		return {
			responsibleEid: responsibleEid === "null" ? null : responsibleEid,
			title: this.taskForm.get("title")?.value,
			description: this.taskForm.get("description")?.value,
			type: parseInt(this.taskForm.get("type")?.value),
			priority: parseInt(this.taskForm.get("priority")?.value),
			complexity:
				this.isEditMode && this.userStory?.effortScore ? parseInt(this.taskForm.get("complexity")?.value) : undefined,
		};
	}

	private createTask(taskNewRequest: TaskNewRequest) {
		this.taskApiService.newTask(taskNewRequest, this.projectEid).subscribe((taskResponse: TaskResponse) => {
			this.disableButtonDuringRequest = false;
			this.handleTaskAndClosePopupEmitter.emit(taskResponse);
		});
	}

	private updateTask(taskUpdateRequest: TaskUpdateRequest) {
		this.taskApiService.updateTask(taskUpdateRequest, this.projectEid, this.taskEditData.eid).subscribe(() => {
			this.disableButtonDuringRequest = false;
			this.handleEditedTaskAndClosePopupEmitter.emit();
		});
	}
}
