import { Component, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, Renderer2, OnInit } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { EpicSelfComposite } from "forge-shared/dto/composite/epicselfcomposite.dto";
import { EpicSelfResponse } from "forge-shared/dto/response/epicselfresponse.dto";
import { Observable, combineLatest, forkJoin, of, throwError } from "rxjs";
import { catchError, map, mergeMap, shareReplay, switchMap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
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

export interface History {
	type: string;
	key: string;
	subject: string;
	description: string;
	status: string;
	assignee: string;
	priority: string;
	created: string;
}

const historiesData: History[] = [
	{
		type: "Feature",
		key: "TASK-001",
		subject: "Implement login functionality",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "In Progress",
		assignee: "John Doe",
		priority: "High",
		created: "2022-01-01",
	},
	{
		type: "Bug",
		key: "BUG-001",
		subject: "Fix navigation bar alignment",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "Backlog",
		assignee: "Jane Smith",
		priority: "Medium",
		created: "2022-01-02",
	},
	{
		type: "Tests",
		key: "BUG-001",
		subject: "Fix navigation bar alignment",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "Done",
		assignee: "Jane Smith",
		priority: "Low",
		created: "2022-01-02",
	},
	{
		type: "Feature",
		key: "TASK-001",
		subject: "Implement login functionality",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "In Progress",
		assignee: "John Doe",
		priority: "High",
		created: "2022-01-01",
	},
	{
		type: "Feature",
		key: "BUG-001",
		subject: "Fix navigation bar alignment",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "In Progress",
		assignee: "Jane Smith",
		priority: "Medium",
		created: "2022-01-02",
	},
	{
		type: "Tests",
		key: "BUG-001",
		subject: "Fix navigation bar alignment",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "Done",
		assignee: "Jane Smith",
		priority: "Low",
		created: "2022-01-02",
	},
];

@Component({
	selector: "app-backlog-page",
	standalone: true,
	imports: [NavbarComponent, MatIcon, MatExpansionModule, MatTableModule, CommonModule, ReactiveFormsModule],
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

	getUserStories(epicEid: string): Observable<UserstorySelfComposite[]> {
		return this.epicApiService.getEpic(this.projectEid, epicEid).pipe(
			map((epicResponse: EpicResponse) => {
				return epicResponse.userstories;
			}),
		);
	}

	@ViewChildren("itemCell")
	itemCell!: QueryList<ElementRef>;

	@ViewChildren("statusContainer")
	statusContainer!: QueryList<ElementRef>;

	@ViewChildren("statusPopUp")
	statusPopUp!: QueryList<ElementRef>;

	@ViewChild(MatTable)
	table!: MatTable<History>;

	constructor(
		private renderer: Renderer2,
		private route: ActivatedRoute,
		private epicApiService: EpicApiService,
		private formBuilder: FormBuilder,
		private taskApiService: TaskApiService,
		private projectApiService: ProjectApiService,
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
	dataSource = [...historiesData];

	tasksMap$: Observable<{ [userStoryEid: string]: TaskSelfComposite[] }> = new Observable();
	tasksDataSources: { [userStoryEid: string]: MatTableDataSource<TaskSelfComposite> } = {};
	projectMembersMap: Record<string, ProjectMemberComposite> = {};

	popUpTask: boolean = false;
	popUpAddToSprint: boolean = false;
	popUpCreateTask: boolean = false;
	clickedItemDetails: History = {
		type: "",
		key: "",
		subject: "",
		description: "",
		status: "",
		assignee: "",
		priority: "",
		created: "",
	};

	addToSprintForm!: FormGroup;
	createTaskForm!: FormGroup;
	isPanelDisabled: boolean = false;
	eidSelectedUserStory: string = "";

	selectedTask$: Observable<TaskResponse> = new Observable();

	toggleExpansionPanel() {
		this.isPanelDisabled = !this.isPanelDisabled;
	}

	ngAfterViewInit(): void {
		this.setTypeColor();
		this.setStatusStyle();
	}

	openTaskPopUp(taskEid: string) {
		this.selectedTask$ = this.taskApiService.getTask(this.projectEid, taskEid);
		this.popUpTask = true;
		setTimeout(() => {
			// Wait for the pop-up to be rendered
			this.setStatusStylePopUp();
		}, 120);
	}

	setStatusStylePopUp() {
		this.statusPopUp.forEach((cell) => {
			const { color, background, textDecoration, fontWeight } = this.determineStyle(cell.nativeElement.textContent.trim());
			cell.nativeElement.style.backgroundColor = `${background}`;
			cell.nativeElement.style.color = `${color}`;
			cell.nativeElement.style.textDecoration = `${textDecoration}`;
			cell.nativeElement.style.fontWeight = `${fontWeight}`;
		});
	}

	openPopUpAddToSprint() {
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
		});
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

	submitAddToSprintForm() {
		this.closePopUpAddToSprint();
	}

	submitCreateTaskForm() {
		const title = this.createTaskForm.get("title");
		const responsibleEid = this.createTaskForm.get("responsible");
		const description = this.createTaskForm.get("description");
		const type = this.createTaskForm.get("type");

		const taskNewRequest = {
			userstoryEid: this.eidSelectedUserStory,
			responsibleEid: responsibleEid?.value,
			title: title?.value,
			description: description?.value,
			type: parseFloat(type?.value),
			status: TaskStatus.TODO,
		} as TaskNewRequest;
		this.createTask(taskNewRequest);
		this.closePopUpCreateTask();
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

	priorityParserString(priority: string) {
		let pre = "../../../../../assets/";
		let pos = ".svg";

		return pre + priority.toLowerCase() + pos;
	}

	priorityParser(priority: number) {
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

	determineStyle(status: string) {
		let color;
		let background;
		let textDecoration;
		let fontWeight;

		switch (status) {
			case "In Progress":
			case "Available to review":
			case "In review":
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
				return "Done";
			case 4:
				return "Cancelled";
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
