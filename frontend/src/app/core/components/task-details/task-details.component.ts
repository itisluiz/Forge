import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { TaskResponse } from "forge-shared/dto/response/taskresponse.dto";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";
import { UserstoryApiService } from "../../services/userstory-api.service";
import { MatIcon } from "@angular/material/icon";
import { PriorityPipe } from "../../pipes/priority.pipe";
import { IconPipe } from "../../pipes/icon.pipe";
import { DeletePopupComponent } from "../delete-popup/delete-popup.component";
import { TaskApiService } from "../../services/task-api.service";
import { TaskPopupComponent } from "../task-popup/task-popup.component";
import { ProjectApiService } from "../../services/project-api.service";

@Component({
	selector: "app-task-details",
	standalone: true,
	imports: [CommonModule, MatIcon, PriorityPipe, IconPipe, DeletePopupComponent, TaskPopupComponent],
	templateUrl: "./task-details.component.html",
	styleUrl: "./task-details.component.scss",
})
export class TaskDetailsComponent implements OnInit {
	@Input() task!: TaskResponse;
	@Input() responsible!: ProjectMemberComposite | null;
	@Input() projectEid!: string;
	userStory: UserstoryResponse | null = null;
	@Output() closePopUpEmitter = new EventEmitter<void>();
	@Output() closePopUpEmitterDeletedTask = new EventEmitter<TaskResponse>();
	@Output() closePopUpEmitterEditedTask = new EventEmitter<TaskResponse>();
	projectMembersMap: Record<string, ProjectMemberComposite> = {};

	popUpDeleteTask: boolean = false;
	popUpEditTask: boolean = false;

	@ViewChildren("statusPopUp")
	statusPopUp?: QueryList<ElementRef>;

	constructor(
		private router: Router,
		private userstoryApiService: UserstoryApiService,
		private taskApiService: TaskApiService,
		private projectApiService: ProjectApiService,
	) {}

	ngOnInit(): void {
		this.loadUserStory();
		this.loadMembersData();
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

	getProjectMemberFromMap(userEid: string | undefined): ProjectMemberComposite | null {
		if (!userEid) return null;
		return this.projectMembersMap[userEid] || null;
	}

	loadUserStory() {
		if (this.task.userstoryEid) {
			this.userstoryApiService.get(this.projectEid, this.task.userstoryEid).subscribe((userStory) => {
				this.userStory = userStory;
			});
		}
	}

	loadEditedTask() {
		this.taskApiService.getTask(this.projectEid, this.task.eid).subscribe((task) => {
			this.task = task;
			this.loadMembersData();
			this.closePopUpEditTask();
		});
	}

	navigateToUserStory(userStoryEid: string | undefined): void {
		if (userStoryEid) {
			this.router.navigate([this.projectEid, userStoryEid, "user-story"]);
		}
	}

	openPopUpEditTask() {
		this.popUpEditTask = true;
		document.body.style.overflow = "hidden";
	}

	openPopUpDeleteTask() {
		this.popUpDeleteTask = true;
		document.body.style.overflow = "hidden";
	}

	onDeleteTask() {
		this.deleteTask();
	}

	deleteTask() {
		this.taskApiService.deleteTask(this.projectEid, this.task.eid).subscribe({
			next: (result) => {
				console.log("Task deleted successfully");
				this.closePopUpDeleteTask();
				this.closePopUpEmitterDeletedTask.emit(this.task);
				// TODO: Toaster success
			},
			error: (error) => {
				// TODO: Toaster error
				console.log(error.error.message);
			},
		});
	}

	closePopUpDeleteTask() {
		this.popUpDeleteTask = false;
		this.closePopUp();
		document.body.style.overflow = "auto";
	}

	closePopUpCancelled() {
		this.popUpDeleteTask = false;
		document.body.style.overflow = "auto";
	}

	closePopUpEditTask() {
		this.closePopUpEmitterEditedTask.emit(this.task);
		this.popUpEditTask = false;
		document.body.style.overflow = "auto";
	}

	closePopUp() {
		this.closePopUpEmitter.emit();
	}

	typeParser(type: number): string {
		this.setStatusStylePopUp();
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

	setStatusStylePopUp() {
		if (this.statusPopUp) {
			this.statusPopUp.forEach((cell) => {
				const { color, background, textDecoration, fontWeight } = this.determineStyle(cell.nativeElement.textContent.trim());
				cell.nativeElement.style.backgroundColor = `${background}`;
				cell.nativeElement.style.color = `${color}`;
				cell.nativeElement.style.textDecoration = `${textDecoration}`;
				cell.nativeElement.style.fontWeight = `${fontWeight}`;
			});
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
}
