import { Component, OnInit, ViewChild } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressBar } from "@angular/material/progress-bar";
import {
	CdkDragDrop,
	CdkDrag,
	CdkDropList,
	CdkDropListGroup,
	moveItemInArray,
	transferArrayItem,
	DragDropModule,
	CdkDragPlaceholder,
} from "@angular/cdk/drag-drop";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { UserstoryApiService } from "../../../services/userstory-api.service";
import { SprintApiService } from "../../../services/sprint-api.service";
import { CommonModule } from "@angular/common";
import { SprintSelfComposite } from "forge-shared/dto/composite/sprintselfcomposite.dto";
import { SprintPeriodStatusPipe } from "../../../pipes/sprint-periodstatus.pipe";
import { SprintPeriodStatusClassPipe } from "../../../pipes/sprint-periodstatus-class.pipe";
import { SprintResponse } from "forge-shared/dto/response/sprintresponse.dto";
import { UserstorySelfComposite } from "forge-shared/dto/composite/userstoryselfcomposite.dto";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum";
import { TaskTypeClassPipe } from "../../../pipes/task-type-class.pipe";
import { TaskApiService } from "../../../services/task-api.service";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectApiService } from "../../../services/project-api.service";
import { PriorityPipe } from "../../../pipes/priority.pipe";
import { IconPipe } from "../../../pipes/icon.pipe";
import { DaysDifferencePipe } from "../../../pipes/days-difference.pipe";
import { SprintStatusPipe } from "../../../pipes/sprint-status.pipe";
import { SprintStatusClassPipe } from "../../../pipes/sprint-status-class.pipe";
import { MaxLengthPipe } from "../../../pipes/max-length.pipe";
import { TaskDetailsComponent } from "../../task-details/task-details.component";
import { TaskResponse } from "forge-shared/dto/response/taskresponse.dto";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRippleModule } from "@angular/material/core";
import { KanbanColumnComponent } from "../../kanban-column/kanban-column.component";
import { TaskSelfComposite } from "forge-shared/dto/composite/taskselfcomposite.dto";
import { MatMenuModule } from "@angular/material/menu";
import { SprintPopupComponent } from "../../sprint-popup/sprint-popup.component";

@Component({
	selector: "app-kanban-page",
	standalone: true,
	imports: [
		NavbarComponent,
		MatIcon,
		MatExpansionModule,
		DragDropModule,
		CdkDropListGroup,
		CdkDropList,
		CdkDrag,
		CdkDragPlaceholder,
		CommonModule,
		SprintPeriodStatusPipe,
		SprintPeriodStatusClassPipe,
		TaskTypeClassPipe,
		MatProgressBar,
		PriorityPipe,
		IconPipe,
		DaysDifferencePipe,
		SprintStatusPipe,
		SprintStatusClassPipe,
		MaxLengthPipe,
		TaskDetailsComponent,
		MatTooltipModule,
		MatRippleModule,
		RouterModule,
		KanbanColumnComponent,
		MatMenuModule,
		SprintPopupComponent,
	],
	templateUrl: "./kanban-page.component.html",
	styleUrl: "./kanban-page.component.scss",
})
export class KanbanPageComponent implements OnInit {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;
	sprints: SprintSelfComposite[] = [];
	detailedSprints: { [key: string]: SprintResponse } = {};
	userStoriesPerSprint: { [key: string]: UserstorySelfComposite[] } = {};
	userstoryDropListIds: { [key: string]: string[] } = {};
	userstoryExpanded: { [key: string]: string[] } = {};
	project?: ProjectResponse;
	popUpTask: boolean = false;
	popUpUpdateSprint: boolean = false;
	selectedTask!: TaskResponse;
	eidSelectedSprint: string = "";

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userStoryApiService: UserstoryApiService,
		private sprintApiService: SprintApiService,
		private taskApiService: TaskApiService,
		private projectApiService: ProjectApiService,
	) {}

	ngOnInit(): void {
		this.loadSprintData();
	}

	loadDetailedSprint(eid: string) {
		this.sprintApiService.getSprint(this.projectEid, eid).subscribe({
			next: (sprintResponse) => {
				this.detailedSprints[sprintResponse.eid] = sprintResponse;

				const userstoryEids = [...new Set(sprintResponse.tasks.map((task) => task.userstoryEid))];
				userstoryEids.forEach((userstoryEid) => {
					this.userstoryDropListIds[userstoryEid] = [];
				});
			},
		});

		this.userStoryApiService.selfBySprint(this.projectEid, eid).subscribe({
			next: (userStoryResponse) => {
				this.userStoriesPerSprint[eid] = userStoryResponse.userstories;
			},
		});
	}

	loadSprintData() {
		this.detailedSprints = {};
		this.userStoriesPerSprint = {};
		this.userstoryDropListIds = {};

		this.sprintApiService.self(this.projectEid).subscribe({
			next: (sprintSelfResponse) => {
				this.sprints = sprintSelfResponse.sprints;
				this.sprints.forEach((sprint) => {
					this.loadDetailedSprint(sprint.eid);
				});
			},
		});

		this.projectApiService.getEspecificProject(this.projectEid).subscribe({
			next: (projectResponse) => {
				this.project = projectResponse;
			},
		});
	}

	getResponsible(userEid: string) {
		return this.project!.members.find((member) => member.eid === userEid);
	}

	onCdkDropEvent(event: CdkDragDrop<TaskSelfComposite>) {
		if (event.previousContainer === event.container) {
			return;
		}

		const task: TaskSelfComposite = event.item.data;
		const status = event.container.data as any as TaskStatus;

		// Optimistic update
		task.status = status;

		this.taskApiService.updateTask({ status }, this.projectEid, task.eid).subscribe({
			error: () => {
				this.loadSprintData();
			},
		});
	}

	openTaskPopUp(taskEid: string) {
		this.taskApiService.getTask(this.projectEid, taskEid).subscribe({
			next: (task) => {
				this.selectedTask = task;
				this.popUpTask = true;
			},
		});
	}

	navigateTo(path: string) {
		this.router.navigate([path]);
	}

	openPopUpUpdateSprint(sprintEid: string) {
		this.eidSelectedSprint = sprintEid;
		this.popUpUpdateSprint = true;
		document.body.style.overflow = "hidden";
	}

	loadSprintDataAndClosePopUp() {
		this.loadSprintData();
		this.closePopUpUpdateSprint();
	}

	closePopUpUpdateSprint() {
		this.popUpUpdateSprint = false;
		document.body.style.overflow = "auto";
	}

	closePopUpTask() {
		let backgroundPopUp = document.querySelector(".pop-up-background");
		if (backgroundPopUp) {
			backgroundPopUp.classList.add("fade-opacity");
		}

		let popUp = document.querySelector(".history-pop-up");
		if (popUp) {
			popUp.classList.add("fade-out");
		}
		setTimeout(() => {
			this.popUpTask = false;
		}, 200);
	}
}
