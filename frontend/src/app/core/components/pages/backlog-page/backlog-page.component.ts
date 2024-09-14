import { Component, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, Renderer2, OnInit } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { EpicSelfComposite } from "forge-shared/dto/composite/epicselfcomposite.dto";
import { EpicSelfResponse } from "forge-shared/dto/response/epicselfresponse.dto";
import { Observable, combineLatest, forkJoin, of, throwError } from "rxjs";
import { catchError, filter, map, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { EpicApiService } from "../../../services/epic-api.service";
import { UserstorySelfComposite } from "forge-shared/dto/composite/userstoryselfcomposite.dto";
import { EpicResponse } from "forge-shared/dto/response/epicresponse.dto";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TaskSelfComposite } from "forge-shared/dto/composite/taskselfcomposite.dto";
import { TaskApiService } from "../../../services/task-api.service";
import { TaskSelfResponse } from "forge-shared/dto/response/taskselfresponse.dto";
import { Priority } from "forge-shared/enum/priority.enum";
import { UserApiService } from "../../../services/user-api.service";
import { ProjectApiService } from "../../../services/project-api.service";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { UserSelfResponse } from "forge-shared/dto/response/userselfresponse.dto";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { TaskNewRequest } from "forge-shared/dto/request/tasknewrequest.dto";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum";
import { TaskResponse } from "forge-shared/dto/response/taskresponse.dto";
import { SprintApiService } from "../../../services/sprint-api.service";
import { SprintPeriodStatus } from "forge-shared/enum/sprintperiodstatus.enum";
import { SprintSelfResponse } from "forge-shared/dto/response/sprintselfresponse.dto";
import { SprintSelfComposite } from "forge-shared/dto/composite/sprintselfcomposite.dto";
import { UserstoryApiService } from "../../../services/userstory-api.service";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";
import { SprintNewRequest } from "forge-shared/dto/request/sprintnewrequest.dto";
import { SprintStatus } from "forge-shared/enum/sprintstatus.enum";
import { MaxLengthPipe } from "../../../pipes/max-length.pipe";
import { TaskDetailsComponent } from "../../task-details/task-details.component";

@Component({
	selector: "app-backlog-page",
	standalone: true,
	imports: [
		NavbarComponent,
		MatIcon,
		MatExpansionModule,
		MatTableModule,
		CommonModule,
		ReactiveFormsModule,
		MaxLengthPipe,
		TaskDetailsComponent,
	],
	templateUrl: "./backlog-page.component.html",
	styleUrl: "./backlog-page.component.scss",
})
export class BacklogPageComponent implements AfterViewInit, OnInit {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;

	epics$: Observable<EpicSelfComposite[]> = this.epicApiService.getEpics(this.projectEid).pipe(
		map((response: EpicSelfResponse) => {
			return response.epics;
		}),
	);

	allUserStories$: Observable<UserstorySelfComposite[]> = this.epics$.pipe(
		mergeMap((epics: EpicSelfComposite[]) => {
			const userStoriesObservables = epics.map((epic) => this.getUserStories(epic.eid));

			return forkJoin(userStoriesObservables).pipe(
				map((userStoriesArray: UserstorySelfComposite[][]) => userStoriesArray.flat()),
			);
		}),
	);

	userStoriesInBacklog$: Observable<UserstorySelfComposite[]> = this.allUserStories$.pipe(
		map((userStories) => userStories.filter((userStory) => !userStory.sprintEid)),
	);

	getUserStories(epicEid: string): Observable<UserstorySelfComposite[]> {
		return this.epicApiService.getEpic(this.projectEid, epicEid).pipe(
			map((epicResponse: EpicResponse) => {
				return epicResponse.userstories;
			}),
		);
	}

	allSprints$: Observable<SprintSelfResponse> = this.sprintApiService.self(this.projectEid).pipe(
		map((response) => {
			return response;
		}),
	);

	currentAndFutureSprints$: Observable<SprintSelfComposite[]> = this.allSprints$.pipe(
		map((response) => {
			return response.sprints.filter(
				(sprint) => sprint.periodStatus === SprintPeriodStatus.ONGOING || sprint.periodStatus === SprintPeriodStatus.FUTURE,
			);
		}),
	);

	currentSprint$: Observable<SprintSelfComposite> = this.allSprints$.pipe(
		map((response) => response.sprints.find((sprint) => sprint.periodStatus === SprintPeriodStatus.ONGOING)),
		filter((sprint): sprint is SprintSelfComposite => sprint !== undefined),
	);

	userStoriesInCurrentSprint$: Observable<UserstorySelfComposite[]> = this.currentSprint$.pipe(
		switchMap((sprint) => this.userstoryApiService.selfBySprint(this.projectEid, sprint.eid)),
		map((response) => response.userstories),
	);

	task$: Observable<TaskResponse> = new Observable();

	@ViewChildren("itemCell")
	itemCell!: QueryList<ElementRef>;

	@ViewChildren("statusContainer")
	statusContainer!: QueryList<ElementRef>;

	@ViewChild(MatTable)
	table!: MatTable<History>;

	constructor(
		private route: ActivatedRoute,
		private epicApiService: EpicApiService,
		private formBuilder: FormBuilder,
		private taskApiService: TaskApiService,
		private projectApiService: ProjectApiService,
		private sprintApiService: SprintApiService,
		private userstoryApiService: UserstoryApiService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.tasksMap$ = this.allUserStories$.pipe(
			switchMap((userStories) => {
				const tasksObservables = userStories.map((userStory) =>
					this.getTasks(userStory.eid).pipe(
						catchError(() => of([])),
						map((tasks) => ({ [userStory.eid]: tasks })),
					),
				);

				return combineLatest(tasksObservables).pipe(
					map((tasksArray) => tasksArray.filter((entry) => entry !== null).reduce((acc, curr) => ({ ...acc, ...curr }), {})),
				);
			}),
			shareReplay(1),
		);

		this.tasksMap$.subscribe((tasksMap) => {
			Object.keys(tasksMap).forEach((userStoryEid) => {
				this.tasksDataSources[userStoryEid] = new MatTableDataSource(tasksMap[userStoryEid]);
			});
		});

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

	getTasks(userStoryEid: string): Observable<TaskSelfComposite[]> {
		return this.taskApiService.getTasks(this.projectEid, userStoryEid).pipe(
			map((taskResponse: TaskSelfResponse) => {
				return taskResponse.tasks;
			}),
		);
	}

	displayedColumns: string[] = ["type", "key", "subject", "status", "assignee", "priority", "created"];

	tasksMap$: Observable<{ [userStoryEid: string]: TaskSelfComposite[] }> = new Observable();
	tasksDataSources: { [userStoryEid: string]: MatTableDataSource<TaskSelfComposite> } = {};
	projectMembersMap: Record<string, ProjectMemberComposite> = {};

	popUpTask: boolean = false;
	popUpAddToSprint: boolean = false;
	popUpCreateTask: boolean = false;
	popUpCreateSprint: boolean = false;

	addToSprintForm!: FormGroup;
	createTaskForm!: FormGroup;
	createSprintForm!: FormGroup;

	isPanelDisabled: boolean = false;
	eidSelectedUserStory: string = "";

	selectedTask!: TaskResponse;

	toggleExpansionPanel() {
		this.isPanelDisabled = !this.isPanelDisabled;
	}

	ngAfterViewInit(): void {
		this.setTypeColor();
		this.setStatusStyle();
	}

	openTaskPopUp(task: TaskResponse) {
		this.selectedTask = task;
		this.popUpTask = true;
	}

	openPopUpAddToSprint(userStoryEid: string) {
		this.eidSelectedUserStory = userStoryEid;
		this.popUpAddToSprint = true;
		this.toggleExpansionPanel();
		document.body.style.overflow = "hidden";
		this.buildAddToSprintForm();
	}

	buildAddToSprintForm() {
		this.addToSprintForm = this.formBuilder.group({
			sprint: ["", Validators.required],
		});
	}

	openPopUpCreateTask(userStoryEid: string) {
		this.eidSelectedUserStory = userStoryEid;
		this.popUpCreateTask = true;
		document.body.style.overflow = "hidden";
		this.buildCreateTaskForm();
	}

	buildCreateTaskForm() {
		this.createTaskForm = this.formBuilder.group({
			title: ["", [Validators.required, Validators.minLength(3)]],
			responsible: ["", Validators.required],
			description: ["", [Validators.required, Validators.minLength(3)]],
			type: ["", Validators.required],
			priority: ["", Validators.required],
		});
	}

	openPopUpCreateSprint() {
		this.popUpCreateSprint = true;
		document.body.style.overflow = "hidden";
		this.buildCreateSprintForm();
	}

	buildCreateSprintForm() {
		this.createSprintForm = this.formBuilder.group({
			startDate: [this.getCurrentDate(), Validators.required],
			endDate: [this.getDateAfterDays(15), Validators.required],
		});
	}

	private getCurrentDate(): string {
		const today = new Date();
		return today.toISOString().split("T")[0];
	}

	private getDateAfterDays(days: number): string {
		const date = new Date();
		date.setDate(date.getDate() + days);
		return date.toISOString().split("T")[0];
	}

	closePopUp() {
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

	closePopUpAddToSprint() {
		this.popUpAddToSprint = false;
		this.toggleExpansionPanel();
	}

	closePopUpCreateTask() {
		this.popUpCreateTask = false;
		document.body.style.overflow = "auto";
	}

	closePopUpCreateSprint() {
		this.popUpCreateSprint = false;
		document.body.style.overflow = "auto";
	}

	submitAddToSprintForm() {
		const sprintEid = this.addToSprintForm.get("sprint");
		const userStoryUpdateRequest = { sprintEid: sprintEid?.value };
		this.userstoryApiService
			.updateUserstories(this.projectEid, this.eidSelectedUserStory, userStoryUpdateRequest)
			.subscribe({
				next: () => {
					this.closePopUpAddToSprint();
					this.updateAllUserStoriesPlacement();
				},
				error: (error) => {
					console.log(error.error.message);
				},
			});
	}

	updateAllUserStoriesPlacement() {
		this.userStoriesInCurrentSprint$ = this.currentSprint$.pipe(
			switchMap((sprint) => this.userstoryApiService.selfBySprint(this.projectEid, sprint.eid)),
			map((response) => response.userstories),
		);

		this.userStoriesInBacklog$ = this.allUserStories$.pipe(
			map((userStories) => userStories.filter((userStory) => !userStory.sprintEid)),
		);
	}

	submitCreateTaskForm() {
		const title = this.createTaskForm.get("title");
		const responsibleEid = this.createTaskForm.get("responsible");
		const description = this.createTaskForm.get("description");
		const type = this.createTaskForm.get("type");
		const priority = this.createTaskForm.get("priority");

		const taskNewRequest = {
			userstoryEid: this.eidSelectedUserStory,
			responsibleEid: responsibleEid?.value,
			title: title?.value,
			description: description?.value,
			type: parseInt(type?.value),
			status: TaskStatus.TODO,
			priority: parseInt(priority?.value),
		} as TaskNewRequest;
		this.createTask(taskNewRequest);
		this.closePopUpCreateTask();
	}

	submitCreateSprintForm() {
		const startDateValue = this.createSprintForm.get("startDate")?.value;
		const endDateValue = this.createSprintForm.get("endDate")?.value;

		const startDate = this.convertLocalToUTCISO(startDateValue);
		const endDate = this.convertLocalToUTCISO(endDateValue);

		const sprintNewRequest = {
			startsAt: startDate,
			endsAt: endDate,
			status: SprintStatus.PLAN,
		} as SprintNewRequest;

		this.sprintApiService.newSprint(sprintNewRequest, this.projectEid).subscribe({
			next: (sprint) => {
				this.allSprints$ = this.sprintApiService.self(this.projectEid);
				this.currentAndFutureSprints$ = this.allSprints$.pipe(
					map((response) => {
						return response.sprints.filter(
							(sprint) =>
								sprint.periodStatus === SprintPeriodStatus.ONGOING || sprint.periodStatus === SprintPeriodStatus.FUTURE,
						);
					}),
				);
				this.currentSprint$ = this.allSprints$.pipe(
					map((response) => response.sprints.find((sprint) => sprint.periodStatus === SprintPeriodStatus.ONGOING)),
					filter((sprint): sprint is SprintSelfComposite => sprint !== undefined),
				);
				this.closePopUpCreateSprint();
			},
			error: (error) => {
				console.log(error.error.message);
			},
		});

		this.closePopUpCreateSprint();
	}

	private convertLocalToUTCISO(date: string): string {
		const localDate = new Date(date);
		const localTimezoneOffset = localDate.getTimezoneOffset();
		const localDateUTC = new Date(localDate.getTime() + localTimezoneOffset * 60000);
		return localDateUTC.toISOString();
	}

	createTask(taskNewRequest: TaskNewRequest) {
		this.taskApiService.newTask(taskNewRequest, this.projectEid).subscribe({
			next: (task) => {
				this.addNewTaskInDataSource(task);
			},
			error: (error) => {
				console.log(error.error.message);
			},
		});
	}

	addNewTaskInDataSource(task: TaskResponse) {
		const dataSource = this.getTasksDataSource(task.userstoryEid);
		dataSource.data = [...dataSource.data, task];
		this.tasksDataSources[task.userstoryEid] = dataSource;
		this.closePopUpCreateTask();
	}

	setTypeColor() {
		this.itemCell.forEach((cell) => {
			let color;
			switch (cell.nativeElement.textContent.trim()) {
				case "Feature":
					color = "#6dc955";
					break;
				case "Bug":
					color = "#CA7B1D";
					break;
				default:
					color = "#1A73DC";
			}
			cell.nativeElement.style.borderLeft = `4px solid ${color}`;
		});
	}

	setStatusStyle() {
		this.statusContainer.forEach((cell) => {
			const { color, background, textDecoration, fontWeight } = this.determineStyle(cell.nativeElement.textContent.trim());
			cell.nativeElement.style.backgroundColor = `${background}`;
			cell.nativeElement.style.color = `${color}`;
			cell.nativeElement.style.textDecoration = `${textDecoration}`;
			cell.nativeElement.style.fontWeight = `${fontWeight}`;
		});
	}

	priorityImageParser(priority: number) {
		let pre = "../../../../../assets/";
		let pos = ".svg";
		let priorityName: string;

		switch (priority) {
			case Priority.LOW:
				priorityName = "low";
				break;
			case Priority.MEDIUM:
				priorityName = "medium";
				break;
			case Priority.HIGH:
				priorityName = "high";
				break;
			default:
				throw new Error("Invalid priority");
		}
		return pre + priorityName + pos;
	}

	priorityTextParser(priority: number) {
		switch (priority) {
			case Priority.LOW:
				return "Low";
			case Priority.MEDIUM:
				return "Medium";
			case Priority.HIGH:
				return "High";
			default:
				throw new Error("Invalid priority");
		}
	}

	determineStyle(status: string) {
		let color;
		let background;
		let textDecoration;
		let fontWeight;

		switch (status) {
			case "In Progress":
				color = "#fff";
				background = "#FFA500";
				break;
			case "Available t...":
			case "Available to review":
			case "Reviewing":
				color = "#fff";
				background = "#93C088";
				break;
			case "Done":
				color = "#fff";
				background = "#187600";
				textDecoration = "line-through";
				break;
			case "Cancelled":
				color = "#fff";
				background = "#8B0000";
				break;
			default:
				color = "#7A7A7A";
				background = "#D8D8D8";
				fontWeight = "400";
		}

		return { color, background, textDecoration, fontWeight };
	}

	getTasksDataSource(userStoryEid: string): MatTableDataSource<TaskSelfComposite> {
		this.setStatusStyle();
		return this.tasksDataSources[userStoryEid];
	}

	typeParser(type: number): string {
		switch (type) {
			case 1:
				return "Task";
			case 2:
				return "Bug";
			case 3:
				return "Test";
			default:
				return "";
		}
	}

	statusParser(status: number): string {
		switch (status) {
			case 1:
				return "To do";
			case 2:
				return "In Progress";
			case 3:
				return "Available to review";
			case 4:
				return "Reviewing";
			case 5:
				return "Done";
			case 6:
				return "Cancelled";
			default:
				return "";
		}
	}

	sprintStatusParser(status: number): string {
		switch (status) {
			case SprintStatus.PLAN:
				return "Plan";
			case SprintStatus.DESIGN:
				return "Design";
			case SprintStatus.DEVELOP:
				return "Develop";
			case SprintStatus.TEST:
				return "Test";
			case SprintStatus.DEPLOY:
				return "Deploy";
			case SprintStatus.REVIEW:
				return "Review";
			case SprintStatus.LAUNCH:
				return "Launch";
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

	getTaskTypeClass(type: number): string {
		switch (type) {
			case 1:
				return "task-class";
			case 2:
				return "bug-class";
			case 3:
				return "test-class";
			default:
				return "default-class";
		}
	}
}
