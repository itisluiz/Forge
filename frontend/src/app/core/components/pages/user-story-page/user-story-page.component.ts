import { Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { TestCasePopupComponent } from "../../test-case-popup/test-case-popup.component";
import { ActivatedRoute } from "@angular/router";
import { UserstoryApiService } from "../../../services/userstory-api.service";
import { UserStoryPopupComponent } from "../../user-story-popup/user-story-popup.component";
import { MaxLengthPipe } from "../../../pipes/max-length.pipe";
import { PriorityPipe } from "../../../pipes/priority.pipe";
import { TaskApiService } from "../../../services/task-api.service";
import { TaskSelfResponse } from "forge-shared/dto/response/taskselfresponse.dto";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { Observable, Subscription } from "rxjs";
import { ProjectApiService } from "../../../services/project-api.service";
import { IconPipe } from "../../../pipes/icon.pipe";
import { TaskDetailsComponent } from "../../task-details/task-details.component";
import { TaskResponse } from "forge-shared/dto/response/taskresponse.dto";

export interface testCaseDisplay {
	key: string;
	description: string;
	link: string;
}

// TODO: Remove when backend is connected
const TEST_CASES_DATA: testCaseDisplay[] = [
	{
		key: "FEA-001",
		description: "Guest user can create an account from the homepage",
		link: "undefinedUrl",
	},
	{
		key: "FEA-002",
		description: "Guest user can create an account from the homepage",
		link: "undefinedUrl",
	},
	{
		key: "FEA-003",
		description: "Guest user can create an account from the homepage",
		link: "undefinedUrl",
	},
	{
		key: "FEA-004",
		description: "Guest user can create an account from the homepage",
		link: "undefinedUrl",
	},
];

@Component({
	selector: "app-user-story-page",
	standalone: true,
	imports: [
		NavbarComponent,
		MatIcon,
		MatExpansionModule,
		MatTab,
		MatTabGroup,
		MatTable,
		MatTableModule,
		MatSelectModule,
		CommonModule,
		TestCasePopupComponent,
		UserStoryPopupComponent,
		MaxLengthPipe,
		PriorityPipe,
		IconPipe,
		TaskDetailsComponent,
	],
	templateUrl: "./user-story-page.component.html",
	styleUrl: "./user-story-page.component.scss",
})
export class UserStoryPageComponent implements OnInit {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;
	userstoryEid: string = this.route.snapshot.paramMap.get("userstoryEid")!;

	displayedColumnsTestCases: string[] = ["key", "description", "link"];

	displayedColumnsTasks: string[] = ["type", "key", "subject", "status", "assignee", "priority", "created"];

	acceptanceCriteria: string[] = [
		"Guest users can click the profile icon in the home page and create an account.",
		"Guest users can proceed to the cart page and create an account.",
		"Guest users can click the wishlist icon against the product to display the wishlist overlay and create an account.",
		"An error message will display if the user enters an existing or invalid email address and other details.",
		"All fields cannot be blank. An error message will display if the user registers with a blank field.",
	];
	testCases = [...TEST_CASES_DATA];

	popUpTestCase: boolean = false;
	popUpEditUserStory: boolean = false;
	popUpTask: boolean = false;

	userStory$ = this.userstoryApiService.get(this.projectEid, this.userstoryEid);

	tasks?: TaskSelfResponse;

	projectMembersMap: Record<string, ProjectMemberComposite> = {};

	@ViewChildren("statusContainer")
	statusContainer!: QueryList<ElementRef>;

	acceptanceCriteria$ = this.userstoryApiService.getAcceptanceCriteria(this.projectEid, this.userstoryEid);
	selectedTask!: TaskResponse;

	private subscriptions = new Subscription();

	constructor(
		private route: ActivatedRoute,
		private userstoryApiService: UserstoryApiService,
		private taskApiService: TaskApiService,
		private projectApiService: ProjectApiService,
	) {}

	ngOnInit(): void {
		this.loadMembersData();
		this.loadTasksData();
	}

	loadTasksData() {
		const taskSub = this.taskApiService.getTasks(this.projectEid, this.userstoryEid).subscribe({
			next: (tasks) => {
				this.tasks = tasks;
			},
		});
		this.subscriptions.add(taskSub);
	}

	loadMembersData() {
		const membersSub = this.projectApiService.getEspecificProject(this.projectEid).subscribe({
			next: (project) => {
				project.members.forEach((member) => {
					this.projectMembersMap[member.eid] = member;
				});
			},
		});
		this.subscriptions.add(membersSub);
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

	openPopUpTestCase() {
		this.popUpTestCase = true;
		document.body.style.overflow = "hidden";
	}

	openPopUpEditUserStory() {
		this.popUpEditUserStory = true;
		document.body.style.overflow = "hidden";
	}

	openTaskPopUp(task: TaskResponse) {
		this.selectedTask = task;
		this.popUpTask = true;
	}

	closePopUpTestCase() {
		this.popUpTestCase = false;
		document.body.style.overflow = "auto";
	}

	closePopUpEditUserStory() {
		this.popUpEditUserStory = false;
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

	setUpdatedUserStory() {
		this.userStory$ = this.userstoryApiService.get(this.projectEid, this.userstoryEid);
		this.closePopUpEditUserStory();
	}

	getTaskTypeClass(type: number): string {
		this.setStatusStyle();
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

	getProject(): Observable<ProjectResponse> {
		return this.projectApiService.getEspecificProject(this.projectEid);
	}

	getProjectMemberFromMap(userEid: string | undefined): ProjectMemberComposite | null {
		if (!userEid) return null;
		return this.projectMembersMap[userEid] || null;
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

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
