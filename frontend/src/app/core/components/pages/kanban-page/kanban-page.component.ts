import { Component, OnInit } from "@angular/core";
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
import { ActivatedRoute } from "@angular/router";
import { UserstoryApiService } from "../../../services/userstory-api.service";
import { SprintApiService } from "../../../services/sprint-api.service";
import { CommonModule, DatePipe } from "@angular/common";
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
	],
	templateUrl: "./kanban-page.component.html",
	styleUrl: "./kanban-page.component.scss",
})
export class KanbanPageComponent implements OnInit {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;
	sprints: SprintSelfComposite[] = [];
	detailedSprints: { [key: string]: SprintResponse } = {};
	userStoriesPerSprint: { [key: string]: UserstorySelfComposite[] } = {};
	project?: ProjectResponse;

	constructor(
		private route: ActivatedRoute,
		private userStoryApiService: UserstoryApiService,
		private sprintApiService: SprintApiService,
		private taskApiService: TaskApiService,
		private projectApiService: ProjectApiService,
	) {}

	loadDetailedSprint(eid: string) {
		this.sprintApiService.getSprint(this.projectEid, eid).subscribe({
			next: (sprintResponse) => {
				this.detailedSprints[sprintResponse.eid] = sprintResponse;
			},
		});

		this.userStoryApiService.selfBySprint(this.projectEid, eid).subscribe({
			next: (userStoryResponse) => {
				this.userStoriesPerSprint[eid] = userStoryResponse.userstories;
			},
		});
	}

	loadSprintData() {
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

	getGravatarUrl(userEid: string) {
		return this.project?.members.find((member) => member.eid === userEid)?.gravatar;
	}

	getUsername(userEid: string) {
		const user = this.project?.members.find((member) => member.eid === userEid);
		if (!user) return;

		return `${user.name} ${user.surname}`;
	}

	getTasksOfStatus(sprintEid: string, userstoryEid: string, status: TaskStatus) {
		return this.detailedSprints[sprintEid]?.tasks.filter(
			(task) => task.userstoryEid === userstoryEid && task.status === status,
		);
	}

	ngOnInit(): void {
		this.loadSprintData();
	}

	drop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer.id === event.container.id) {
			return;
		}

		const sprintEid = event.item.element.nativeElement.id.split("-")[1];
		const taskEid = event.item.element.nativeElement.id.split("-")[2];
		const newStatus = Number(event.container.id.split("-")[1]) as TaskStatus;

		this.detailedSprints[sprintEid].tasks.find((task) => task.eid === taskEid)!.status = newStatus;
		this.taskApiService.updateTask({ status: newStatus }, this.projectEid, taskEid).subscribe({
			error: () => {
				this.loadSprintData();
			},
		});
	}
}
