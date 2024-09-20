import { Component, computed, ElementRef, OnInit, QueryList, signal, ViewChild, ViewChildren } from "@angular/core";
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
import { PopupComponent } from "../../popup-component/popup-component";
import { InputComponent } from "../../input-component/input-component";
import { MatCheckboxModule } from "@angular/material/checkbox";

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
		PopupComponent,
		InputComponent,
		MatCheckboxModule,
	],
	templateUrl: "./planning-poker-page.component.html",
	styleUrl: "./planning-poker-page.component.scss",
})
export class PlanningPokerPageComponent implements OnInit {
	@ViewChildren("expand") expand!: QueryList<ElementRef>;
	@ViewChild("pokerSubject") pokerSubject!: InputComponent;

	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;

	scoreToggle: boolean = false;
	expandToggle: boolean = false;
	activeCard: string | null = null;
	inSession: boolean = false;
	popUpCreateSession: boolean = false;
	projectMembersMap: Record<string, ProjectMemberComposite> = {};

	constructor(
		private route: ActivatedRoute,
		private projectApiService: ProjectApiService,
	) {}

	switchSession() {
		this.inSession = !this.inSession;
	}

	ngOnInit(): void {}

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

	getProject(): Observable<ProjectResponse> {
		return this.projectApiService.getEspecificProject(this.projectEid);
	}

	getProjectMemberFromMap(userEid: string | undefined): ProjectMemberComposite | null {
		if (!userEid) return null;
		return this.projectMembersMap[userEid] || null;
	}

	openPopUp(popUp: string, projectTitle?: string, projectId?: string, memberEid?: string, isMemberAdmin?: boolean) {
		if (popUp === "createSession") {
			this.popUpCreateSession = true;
			return;
		}
	}

	closePopUp(popUp: string) {
		if (popUp === "createSession") {
			this.popUpCreateSession = false;
			return;
		}
	}
}
