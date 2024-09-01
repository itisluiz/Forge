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
	concatMap,
	forkJoin,
	from,
	map,
	mergeMap,
	Observable,
	shareReplay,
	switchMap,
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
	sprintEid!: string;

	private currentSprintSubject = new BehaviorSubject<SprintResponse | null>(null);
	currentSprint$ = this.currentSprintSubject.asObservable();

	currentSprint!: SprintResponse;
	userStoriesWithTasks: UserstoryResponse[] = [];
	userStoriesWithTasks$!: Observable<UserstoryResponse[]>;

	userStories$!: Observable<UserstorySelfComposite[]>;

	kanbanMap$: Observable<{ [springEid: string]: SprintSelfComposite[] }> = new Observable();

	tasksMap$: Observable<{ [userstoryEid: string]: TaskSelfComposite[] }> = new Observable();

	constructor(
		private route: ActivatedRoute,
		private userStoryApiService: UserstoryApiService,
		private sprintApiService: SprintApiService,
		private taskApiService: TaskApiService,
	) {}

	ngOnInit(): void {
		this.loadSprint(this.projectEid, 2);

		console.log(this.userStoriesWithTasks);
	}

	loadSprint(projectEid: string, periodStatus: number) {
		this.sprintApiService.self(projectEid).subscribe({
			next: (response: SprintSelfResponse) => {
				const sprint = response.sprints.find((s) => s.periodStatus === periodStatus);

				if (sprint) {
					this.userStories$ = this.getUserStories(projectEid, sprint.eid);

					this.currentSprint = {
						...sprint,
						startsAt: this.formatDate(sprint.startsAt),
						endsAt: this.formatDate(sprint.endsAt),
						tasks: [],
						createdAt: "",
						updatedAt: "",
					};
					this.currentSprintSubject.next(this.currentSprint);
				} else {
					this.currentSprint = {
						eid: "",
						startsAt: "",
						endsAt: "",
						status: 1,
						periodStatus: 1,
						tasks: [],
						createdAt: "",
						updatedAt: "",
					};
				}
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	getUserStories(projectEid: string, sprintEid: string): Observable<UserstorySelfComposite[]> {
		return this.userStoryApiService.selfBySprint(projectEid, sprintEid).pipe(
			switchMap((response: UserstorySelfResponse) => {
				const observables = response.userstories.map((userstory) => this.getEspecificUserStory(projectEid, userstory.eid));
				return forkJoin(observables).pipe(
					map((userStoriesWithTasks: UserstoryResponse[]) => {
						this.userStoriesWithTasks = userStoriesWithTasks;
						return this.userStoriesWithTasks;
					}),
				);
			}),
		);
	}

	getEspecificUserStory(projectEid: string, userstoryEid: string): Observable<UserstoryResponse> {
		console.log("chamabndio", userstoryEid);
		return this.userStoryApiService.getUserStory(projectEid, userstoryEid);
	}

	getTasks(projectEid: string, userStoryEid: string): Observable<TaskSelfComposite[]> {
		return this.taskApiService.getTasks(projectEid, userStoryEid).pipe(
			map((response: TaskSelfResponse) => {
				return response.tasks;
			}),
		);
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
}
