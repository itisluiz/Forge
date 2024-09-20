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
import { TaskPopupComponent } from "../../task-popup/task-popup.component";
import { DaysDifferencePipe } from "../../../pipes/days-difference.pipe";
import { SprintStatusPipe } from "../../../pipes/sprint-status.pipe";
import { SprintStatusClassPipe } from "../../../pipes/sprint-status-class.pipe";
import { SprintPeriodStatusPipe } from "../../../pipes/sprint-periodstatus.pipe";
import { SprintPeriodStatusClassPipe } from "../../../pipes/sprint-periodstatus-class.pipe";
import { SprintResponse } from "forge-shared/dto/response/sprintresponse.dto";
import { MatMenuModule } from "@angular/material/menu";

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
		TaskPopupComponent,
		DaysDifferencePipe,
		SprintStatusPipe,
		SprintStatusClassPipe,
		SprintPeriodStatusPipe,
		SprintPeriodStatusClassPipe,
		MatMenuModule,
	],
	templateUrl: "./backlog-page.component.html",
	styleUrl: "./backlog-page.component.scss",
})
export class BacklogPageComponent implements AfterViewInit, OnInit {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;

	allSprints: SprintSelfComposite[] = [];
	currentSprint: SprintSelfComposite = {} as SprintSelfComposite;
	currentAndFutureSprints: SprintSelfComposite[] = [];
	pastSprints: SprintSelfComposite[] = [];
	futureSprints: SprintSelfComposite[] = [];
	detailedSprints: { [key: string]: SprintResponse } = {};
	userStoriesPerSprint: { [key: string]: UserstorySelfComposite[] } = {};
	allUserStories: UserstorySelfComposite[] = [];
	userStoriesInBacklog: UserstorySelfComposite[] = [];
	tasksPerUserStory: { [userStoryEid: string]: TaskSelfComposite[] } = {};
	tasksDataSources: { [userStoryEid: string]: MatTableDataSource<TaskSelfComposite> } = {};
	projectMembersMap: Record<string, ProjectMemberComposite> = {};

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
		this.loadSprintData();
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

	loadSprintData() {
		this.sprintApiService.self(this.projectEid).subscribe({
			next: (sprintSelfResponse) => {
				// Load all Sprints
				this.allSprints = sprintSelfResponse.sprints;

				// Load current Sprint
				this.currentSprint =
					this.allSprints.find((sprint) => sprint.periodStatus === SprintPeriodStatus.ONGOING) ||
					({} as SprintSelfComposite);

				// Load current and future Sprints
				this.currentAndFutureSprints = this.allSprints.filter(
					(sprint) =>
						sprint.periodStatus === SprintPeriodStatus.ONGOING || sprint.periodStatus === SprintPeriodStatus.FUTURE,
				);

				// Load past Sprints to use in HTML to either display or not the Past Sprints block
				this.pastSprints = this.allSprints.filter((sprint) => sprint.periodStatus === SprintPeriodStatus.PAST);

				// Load future Sprints to use in HTML to either display or not the Future Sprints block
				this.futureSprints = this.allSprints.filter((sprint) => sprint.periodStatus === SprintPeriodStatus.FUTURE);

				sprintSelfResponse.sprints.forEach((sprint) => {
					this.loadDetailedSprint(sprint.eid);
				});
			},
		});
	}

	loadDetailedSprint(eid: string) {
		// O forkJoin tá pegando os dados de sprint e userstory ao mesmo tempo e depois o subscribe tá separando eles
		forkJoin({
			sprintResponse: this.sprintApiService.getSprint(this.projectEid, eid),
			userStoryResponse: this.userstoryApiService.selfBySprint(this.projectEid, eid),
		}).subscribe({
			next: ({ sprintResponse, userStoryResponse }) => {
				this.detailedSprints[sprintResponse.eid] = sprintResponse;
				this.userStoriesPerSprint[eid] = userStoryResponse.userstories;
			},
		});
		this.loadBacklogData();
	}

	loadBacklogData() {
		this.epicApiService
			.getEpics(this.projectEid)
			.pipe(switchMap((epicResponse) => this.epicApiService.getEpic(this.projectEid, epicResponse.epics[0].eid)))
			.subscribe({
				next: (epicResponse) => {
					this.allUserStories = epicResponse.userstories;
					this.userStoriesInBacklog = this.allUserStories.filter((userStory) => !userStory.sprintEid);
					this.loadTasks();
				},
				error: (err) => {
					console.error("Error loading backlog data", err);
				},
			});
	}

	loadTasks() {
		this.allUserStories.forEach((userStory) => {
			this.getTasks(userStory.eid).subscribe({
				next: (tasks) => {
					this.tasksPerUserStory[userStory.eid] = tasks;
					this.tasksDataSources[userStory.eid] = new MatTableDataSource(tasks);
				},
			});
		});
	}

	getTasks(userStoryEid: string): Observable<TaskSelfComposite[]> {
		return this.taskApiService.getTasks(this.projectEid, userStoryEid).pipe(
			map((taskResponse: TaskSelfResponse) => {
				return taskResponse.tasks;
			}),
		);
	}

	displayedColumns: string[] = ["type", "key", "subject", "status", "assignee", "priority", "created"];

	popUpTask: boolean = false;
	popUpAddToSprint: boolean = false;
	popUpCreateTask: boolean = false;
	popUpCreateSprint: boolean = false;

	addToSprintForm!: FormGroup;
	createSprintForm!: FormGroup;

	eidSelectedUserStory: string = "";
	selectedTask!: TaskResponse;

	isPanelDisabled: boolean = false;
	toggleExpansionPanel() {
		this.isPanelDisabled = !this.isPanelDisabled;
	}

	ngAfterViewInit(): void {
		this.setTypeColor();
		this.setStatusStyle();
	}

	// Open Popups

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

	openPopUpCreateTask(userStoryEid: string) {
		this.eidSelectedUserStory = userStoryEid;
		this.popUpCreateTask = true;
		document.body.style.overflow = "hidden";
	}

	private getCurrentDate(): string {
		const today = new Date();
		today.setHours(today.getHours() - 3); // Brazil time
		return today.toISOString().split("T")[0];
	}

	private getDateAfterDays(days: number): string {
		const date = new Date();
		date.setDate(date.getDate() + days);
		date.setHours(date.getHours() - 3); // Brazil time
		return date.toISOString().split("T")[0];
	}

	// Close Popups

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
		document.body.style.overflow = "auto";
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

	// Submit Forms

	submitAddToSprintForm() {
		const sprintEid = this.addToSprintForm.get("sprint");
		const userStoryUpdateRequest = { sprintEid: sprintEid?.value };
		this.userstoryApiService
			.updateUserstories(this.projectEid, this.eidSelectedUserStory, userStoryUpdateRequest)
			.subscribe({
				next: () => {
					this.closePopUpAddToSprint();
					this.loadSprintData();
				},
				error: (error) => {
					console.log(error.error.message);
				},
			});
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
				this.loadSprintData();
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

	addNewTaskInDataSource(task: TaskResponse) {
		const dataSource = this.getTasksDataSource(task.userstoryEid);
		dataSource.data = [...dataSource.data, task];
		this.tasksDataSources[task.userstoryEid] = dataSource;
		this.closePopUpCreateTask();
	}

	removeTaskFromDataSource(task: TaskResponse) {
		const dataSource = this.getTasksDataSource(task.userstoryEid);
		dataSource.data = dataSource.data.filter((t) => t.eid !== task.eid);
		this.tasksDataSources[task.userstoryEid] = dataSource;
		this.closePopUp();
	}

	// Styling

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

	// Get Project infos

	getProject(): Observable<ProjectResponse> {
		return this.projectApiService.getEspecificProject(this.projectEid);
	}

	getProjectMemberFromMap(userEid: string | undefined): ProjectMemberComposite | null {
		if (!userEid) return null;
		return this.projectMembersMap[userEid] || null;
	}
}
