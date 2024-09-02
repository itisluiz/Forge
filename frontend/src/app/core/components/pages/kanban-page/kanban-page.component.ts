import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
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
import { ActivatedRoute, Router } from "@angular/router";
import {
	BehaviorSubject,
	catchError,
	concatMap,
	forkJoin,
	from,
	map,
	mergeMap,
	Observable,
	shareReplay,
	switchMap,
	take,
	toArray,
} from "rxjs";
import { SprintSelfComposite } from "forge-shared/dto/composite/sprintselfcomposite.dto";
import { UserstorySelfComposite } from "forge-shared/dto/composite/userstoryselfcomposite.dto";
import { UserstoryApiService } from "../../../services/userstory-api.service";
import { SprintApiService } from "../../../services/sprint-api.service";
import { MatTableDataSource } from "@angular/material/table";
import { SprintResponse } from "forge-shared/dto/response/sprintresponse.dto";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";
import { UserstorySelfResponse } from "forge-shared/dto/response/userstoryselfresponse.dto";
import { CommonModule } from "@angular/common";
import { TaskApiService } from "../../../services/task-api.service";
import { TaskSelfResponse } from "forge-shared/dto/response/taskselfresponse.dto";
import { TaskSelfComposite } from "forge-shared/dto/composite/taskselfcomposite.dto";
import { SprintSelfResponse } from "forge-shared/dto/response/sprintselfresponse.dto";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { ProjectApiService } from "../../../services/project-api.service";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum";
import { TaskUpdateRequest } from "forge-shared/dto/request/taskupdaterequest.dto";

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
	],
	templateUrl: "./kanban-page.component.html",
	styleUrl: "./kanban-page.component.scss",
})
export class KanbanPageComponent implements OnInit {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;

	projectMembersMap: Record<string, ProjectMemberComposite> = {};

	constructor(
		private route: ActivatedRoute,
		private userStoryApiService: UserstoryApiService,
		private sprintApiService: SprintApiService,
		private taskApiService: TaskApiService,
		private projectApiService: ProjectApiService,
	) {}

	allSprints$: Observable<SprintSelfResponse> = this.sprintApiService.self(this.projectEid).pipe(
		map((response) => {
			return response;
		}),
	);

	currentSprint$ = this.allSprints$.pipe(
		map((response) => {
			return response.sprints.find((s) => s.periodStatus === 2);
		}),
	);

	userStoriesFromCurrentSprint$: Observable<UserstorySelfResponse> = this.currentSprint$.pipe(
		switchMap((sprint) => {
			return this.userStoryApiService.selfBySprint(this.projectEid, sprint!.eid);
		}),
	);

	tasksMap$: Observable<{ [userstoryEid: string]: TaskSelfComposite[] }> = new Observable();

	ngOnInit(): void {
		this.tasksMap$ = this.userStoriesFromCurrentSprint$.pipe(
			switchMap((userStories: UserstorySelfResponse) => {
				const tasksObservables: Observable<{ [userStoryEid: string]: TaskSelfComposite[] }>[] = userStories.userstories.map(
					(userStory) =>
						this.getTasks(this.projectEid, userStory.eid).pipe(
							map((tasks: TaskSelfComposite[]) => ({ [userStory.eid]: tasks })),
						),
				);

				return forkJoin(tasksObservables).pipe(
					map((tasksArray: { [userStoryEid: string]: TaskSelfComposite[] }[]) =>
						tasksArray.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
					),
				);
			}),
			shareReplay(1),
		);

		this.tasksMap$.subscribe((u) => console.log("u ", u));

		this.getProject()
			.pipe(
				map((project) => {
					project.members.forEach((member) => {
						this.projectMembersMap[member.eid] = member;
					});
				}),
			)
			.subscribe();
	}

	getTasks(projectEid: string, userStoryEid: string): Observable<TaskSelfComposite[]> {
		return this.taskApiService.getTasks(projectEid, userStoryEid).pipe(
			map((response: TaskSelfResponse) => {
				return response.tasks;
			}),
		);
	}

	getTasksFromMap(userStoryEid: string): Observable<TaskSelfComposite[]> {
		return this.tasksMap$.pipe(map((tasksMap) => tasksMap[userStoryEid]));
	}

	updateTaskStatus(taskEid: string, request: TaskUpdateRequest) {
		this.taskApiService.updateTask(this.projectEid, taskEid, request).subscribe({});
	}

	formatDate(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");

		return `${day}/${month}/${year} • ${hours}:${minutes}`;
	}

	toDo: any = [
		{
			name: "Get to work",
			description: "Description for Get to work",
			currentBehavior: "Current behavior for Get to work",
			expectedBehavior: "Expected behavior for Get to work",
			photo: "../../../assets/photo.jpeg",
			type: "feature",
		},
		{
			name: "Pick up groceries",
			description: "Description for Pick up groceries",
			currentBehavior: "Current behavior for Pick up groceries",
			expectedBehavior: "Expected behavior for Pick up groceries",
			photo: "../../../assets/photo.jpeg",
			type: "test",
		},
		{
			name: "Go home",
			description: "Description for Go home",
			currentBehavior: "Current behavior for Go home",
			expectedBehavior: "Expected behavior for Go home",
			photo: "../../../assets/photo.jpeg",
			type: "bug",
		},
		{
			name: "Fall asleep",
			description: "Description for Fall asleep",
			currentBehavior: "Current behavior for Fall asleep",
			expectedBehavior: "Expected behavior for Fall asleep",
			photo: "../../../assets/photo.jpeg",
			type: "feature",
		},
	];

	inProgress: any = [];

	availableReview: any = [];

	reviewing: any = [];

	done: any = [];

	drop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

			if (event.container.id !== "cdk-drop-list-0" && event.container.data.length === 4) {
				alert("A coluna atingiu 4 cards!");
			}
		}
	}

	typeParser(type: number): string {
		switch (type) {
			case 1:
				return "task";
			case 2:
				return "bug";
			case 3:
				return "test";
			default:
				return "";
		}
	}

	getProject(): Observable<ProjectResponse> {
		return this.projectApiService.getEspecificProject(this.projectEid);
	}

	getProjectMemberFromMap(userEid: string | undefined): ProjectMemberComposite | null {
		if (!userEid) return null;
		return this.projectMembersMap[userEid] || null;
	}

	getAllProjectMembers(): ProjectMemberComposite[] {
		return Object.values(this.projectMembersMap);
	}
}
