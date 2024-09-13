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
import { Observable } from "rxjs";
import { ProjectApiService } from "../../../services/project-api.service";
import { MatRippleModule } from "@angular/material/core";
import { IconPipe } from "../../../pipes/icon.pipe";

@Component({
	selector: "app-planning-poker-page",
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
		MatRippleModule,
	],
	templateUrl: "./planning-poker-page.component.html",
	styleUrl: "./planning-poker-page.component.scss",
})
export class PlanningPokerPageComponent implements OnInit {
	@ViewChildren("expand") expand!: QueryList<ElementRef>;
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;

	scoreToggle: boolean = false;
	expandToggle: boolean = false;
	activeCard: string | null = null;

	setScoreToggle() {
		this.scoreToggle = !this.scoreToggle;
	}

	setExpandToggle() {
		this.expand.forEach((element: ElementRef) => {
			element.nativeElement.style.transition = "height .2s";

			if (!this.expandToggle) {
				element.nativeElement.style.height = "285px";
			} else {
				element.nativeElement.style.height = "160px";
			}
		});

		this.expandToggle = !this.expandToggle;
	}

	setActiveCard(cardValue: string) {
		this.activeCard = cardValue;
	}

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

	popUpActive: boolean = false;
	popUpEditUserStory: boolean = false;

	userStory$ = this.userstoryApiService.get(this.projectEid, this.userstoryEid);

	tasks?: TaskSelfResponse;

	projectMembersMap: Record<string, ProjectMemberComposite> = {};

	@ViewChildren("statusContainer")
	statusContainer!: QueryList<ElementRef>;

	acceptanceCriteria$ = this.userstoryApiService.getAcceptanceCriteria(this.projectEid, this.userstoryEid);
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
		this.taskApiService.getTasks(this.projectEid, this.userstoryEid).subscribe({
			next: (tasks) => {
				this.tasks = tasks;
			},
		});
	}

	loadMembersData() {
		this.projectApiService.getEspecificProject(this.projectEid).subscribe({
			next: (project) => {
				project.members.forEach((member) => {
					this.projectMembersMap[member.eid] = member;
				});
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

	openPopUp() {
		this.popUpActive = true;
		document.body.style.overflow = "hidden";
	}

	openPopUpEditUserStory() {
		this.popUpEditUserStory = true;
		document.body.style.overflow = "hidden";
	}

	closePopUp() {
		this.popUpActive = false;
		document.body.style.overflow = "auto";
	}

	closePopUpEditUserStory() {
		this.popUpEditUserStory = false;
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
}
