import { Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { TestCasePopupComponent } from "../../test-case-popup/test-case-popup.component";
import { ActivatedRoute, Router } from "@angular/router";
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
import { TaskPopupComponent } from "../../task-popup/task-popup.component";
import { MatRippleModule } from "@angular/material/core";
import { TestCaseService } from "../../../services/test-case.service";
import { TestcaseSelfResponse } from "forge-shared/dto/response/testcaseselfresponse.dto";
import { TestcaseNewRequest } from "forge-shared/dto/request/testcasenewrequest.dto";
import { Action } from "rxjs/internal/scheduler/Action";
import { TestcaseStepComposite } from "forge-shared/dto/composite/testcasestepcomposite.dto";
import { AcceptanceCriteriaService } from "../../../services/acceptance-criteria.service";
import { AcceptanceCriteriaSelfResponse } from "forge-shared/dto/response/acceptancecriteriaselfresponse.dto";

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
		TaskPopupComponent,
		MatRippleModule,
	],
	templateUrl: "./user-story-page.component.html",
	styleUrl: "./user-story-page.component.scss",
})
export class UserStoryPageComponent implements OnInit {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;
	userstoryEid: string = this.route.snapshot.paramMap.get("userstoryEid")!;
	projectCode!: string;

	displayedColumnsTestCases: string[] = ["index", "description", "precondition", "stepCount"];

	displayedColumnsTasks: string[] = ["type", "key", "subject", "status", "assignee", "priority", "created"];

	popUpTestCase: boolean = false;
	popUpEditUserStory: boolean = false;
	popUpTask: boolean = false;
	popUpCreateTask: boolean = false;

	userStory$ = this.userstoryApiService.get(this.projectEid, this.userstoryEid);

	tasks?: TaskSelfResponse;
	testCasesREAL!: TestcaseSelfResponse;
	acceptanceCriteriaEidList: any[] = [];

	projectMembersMap: Record<string, ProjectMemberComposite> = {};

	@ViewChildren("statusContainer")
	statusContainer!: QueryList<ElementRef>;

	acceptanceCriteria!: AcceptanceCriteriaSelfResponse;
	acceptanceCriteria$ = this.userstoryApiService.getAcceptanceCriteria(this.projectEid, this.userstoryEid);
	selectedTask!: TaskResponse;

	private subscriptions = new Subscription();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userstoryApiService: UserstoryApiService,
		private taskApiService: TaskApiService,
		private projectApiService: ProjectApiService,
		private testCaseService: TestCaseService,
		private acceptanceCriteriaService: AcceptanceCriteriaService,
	) {}

	ngOnInit(): void {
		this.getProject();
		this.loadMembersData();
		this.loadAllAcceptanceCriteria();
		this.loadTasksData();
	}

	loadTasksData() {
		const taskSub = this.taskApiService.getTasks(this.projectEid, this.userstoryEid).subscribe({
			next: (tasks) => {
				this.tasks = tasks;
				this.closePopUpCreateTask();
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

	loadTestCases(acceptanceCriteriaEid: string) {
		const testCaseSub = this.testCaseService.getAllTestCases(this.projectEid, acceptanceCriteriaEid).subscribe({
			next: (testCases) => {
				this.testCasesREAL = testCases;
				console.log("testCasesREAL", this.testCasesREAL);
			},
		});
		this.subscriptions.add(testCaseSub);
	}

	loadAllAcceptanceCriteria() {
		this.acceptanceCriteriaService.getAllAcceptanceCriteria(this.projectEid, this.userstoryEid).subscribe({
			next: (acceptanceCriteria) => {
				this.acceptanceCriteria = acceptanceCriteria;
				console.log(this.acceptanceCriteria);

				this.acceptanceCriteria.acceptanceCriteria.forEach((ac) => {
					this.acceptanceCriteriaEidList.push(ac.eid);
					this.loadTestCases(ac.eid);
				});
			},
			error: (error) => {
				console.log(error.error.message);
			},
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

	handleFormSubmit(formData: any) {
		console.log("Form data received:", formData);
		// Utilize os dados do formulário aqui
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

	openPopUpCreateTask() {
		this.popUpCreateTask = true;
		document.body.style.overflow = "hidden";
	}

	closePopUpTestCase() {
		this.loadAllAcceptanceCriteria();
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

	closePopUpCreateTask() {
		this.popUpCreateTask = false;
		document.body.style.overflow = "auto";
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

	getProject() {
		this.projectApiService.getEspecificProject(this.projectEid).subscribe({
			next: (projectResponse) => {
				this.projectCode = projectResponse.code;
			},
			error: (error) => {
				console.log(error.error.message);
			},
		});
	}

	getProjectMemberFromMap(userEid: string | undefined) {
		if (userEid) return this.projectMembersMap[userEid];

		return undefined;
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

	navigateToTestCase(testcaseEid: string) {
		this.router.navigate([`${this.projectEid}/${testcaseEid}/testcase`]);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
