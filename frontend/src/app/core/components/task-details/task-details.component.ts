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

@Component({
	selector: "app-task-details",
	standalone: true,
	imports: [CommonModule, MatIcon, PriorityPipe, IconPipe],
	templateUrl: "./task-details.component.html",
	styleUrl: "./task-details.component.scss",
})
export class TaskDetailsComponent implements OnInit {
	@Input() task!: TaskResponse;
	@Input() responsible!: ProjectMemberComposite | null;
	@Input() projectEid!: string;
	userStory: UserstoryResponse | null = null;
	@Output() closePopUpEmitter = new EventEmitter<void>();

	@ViewChildren("statusPopUp")
	statusPopUp?: QueryList<ElementRef>;

	constructor(
		private router: Router,
		private userstoryApiService: UserstoryApiService,
	) {}

	ngOnInit(): void {
		this.loadUserStory();
	}

	loadUserStory() {
		if (this.task.userstoryEid) {
			this.userstoryApiService.get(this.projectEid, this.task.userstoryEid).subscribe((userStory) => {
				this.userStory = userStory;
			});
		}
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

	navigateToUserStory(userStoryEid: string | undefined): void {
		if (userStoryEid) {
			this.router.navigate([this.projectEid, userStoryEid, "user-story"]);
		}
	}

	closePopUp() {
		this.closePopUpEmitter.emit();
	}
}
