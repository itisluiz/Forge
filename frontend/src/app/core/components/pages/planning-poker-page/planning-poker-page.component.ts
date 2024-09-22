import {
	Component,
	computed,
	ElementRef,
	OnDestroy,
	OnInit,
	QueryList,
	signal,
	ViewChild,
	ViewChildren,
} from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { TestCasePopupComponent } from "../../test-case-popup/test-case-popup.component";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { UserstoryApiService } from "../../../services/userstory-api.service";
import { UserStoryPopupComponent } from "../../user-story-popup/user-story-popup.component";
import { MaxLengthPipe } from "../../../pipes/max-length.pipe";
import { PriorityPipe } from "../../../pipes/priority.pipe";
import { TaskApiService } from "../../../services/task-api.service";
import { TaskSelfResponse } from "forge-shared/dto/response/taskselfresponse.dto";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { forkJoin, Observable } from "rxjs";
import { ProjectApiService } from "../../../services/project-api.service";
import { MatRippleModule } from "@angular/material/core";
import { IconPipe } from "../../../pipes/icon.pipe";
import { PopupComponent } from "../../popup-component/popup-component";
import { InputComponent } from "../../input-component/input-component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { PlanningPokerService } from "../../../services/planning-poker.service";
import { PlanningpokerCreatesessionRequest } from "forge-shared/dto/request/planningpokercreatesessionrequest.dto";
import { SprintSelfComposite } from "forge-shared/dto/composite/sprintselfcomposite.dto";
import { UserstorySelfComposite } from "forge-shared/dto/composite/userstoryselfcomposite.dto";
import { SprintApiService } from "../../../services/sprint-api.service";
import { SprintPeriodStatus } from "forge-shared/enum/sprintperiodstatus.enum";
import { SprintResponse } from "forge-shared/dto/response/sprintresponse.dto";
import { PlanningpokerSelfComposite } from "forge-shared/dto/composite/planningpokerselfcomposite.dto";
import { PlanningpokerResponse } from "forge-shared/dto/response/planningpokerresponse.dto";

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
export class PlanningPokerPageComponent implements OnInit, OnDestroy {
	@ViewChildren("expand") expand!: QueryList<ElementRef>;
	@ViewChild("pokerSubject") pokerSubject!: InputComponent;

	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;

	scoreToggle: boolean = false;
	expandToggle: boolean = false;
	activeCard: string | null = null;

	inSession: boolean = false;
	sessionList: boolean = false;

	allSessionList: PlanningpokerSelfComposite[] = [];

	currentSession: string = "";
	currentSessionData: PlanningpokerResponse = {} as PlanningpokerResponse;

	popUpCreateSession: boolean = false;
	projectMembersMap: Record<string, ProjectMemberComposite> = {};
	currentSprint: SprintSelfComposite = {} as SprintSelfComposite;
	allSprints: SprintSelfComposite[] = [];
	allUserStories: string[] = [];
	detailedSprints: { [key: string]: SprintResponse } = {};
	userStoriesPerSprint: { [key: string]: UserstorySelfComposite[] } = {};
	private sessionIntervalId: any;

	constructor(
		private route: ActivatedRoute,
		private projectApiService: ProjectApiService,
		private planningPokerService: PlanningPokerService,
		private userStoryApiService: UserstoryApiService,
		private sprintApiService: SprintApiService,
		private router: Router,
	) {}

	switchSession() {
		this.inSession = !this.inSession;
	}

	ngOnInit(): void {
		this.loadSprintData();
		this.getCurrentSessionList();
	}

	ngOnDestroy(): void {
		if (this.sessionIntervalId) {
			clearInterval(this.sessionIntervalId);
		}
	}

	enterSession(sessionCode: string) {
		this.currentSession = sessionCode;
		this.pullSession();
		this.router.navigate([`/planning-poker/${this.projectEid}/${sessionCode}`]);
		this.inSession = true;

		this.sessionIntervalId = setInterval(() => {
			this.pullSession();
		}, 2000);
	}

	createSession() {
		/* 
		const createRequest: PlanningpokerCreatesessionRequest = {
			agenda: this.pokerSubject.value,
			userstoryEids: this.allUserStories,
		};

		this.planningPokerService.createSession(createRequest, this.projectEid).subscribe({
			next: (result) => {
				this.currentSession = result.sessionCode;
				this.inSession = true;
				this.popUpCreateSession = false;
				this.pullSession();
				this.router.navigate([`/planning-poker/${this.projectEid}/${result.sessionCode}`]);

				this.sessionIntervalId = setInterval(() => {
					this.pullSession();
				}, 2000);
			},
			error: (error) => {
				console.error(error);
			},
		});
		*/
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
			userStoryResponse: this.userStoryApiService.selfBySprint(this.projectEid, eid),
		}).subscribe({
			next: ({ sprintResponse, userStoryResponse }) => {
				this.detailedSprints[sprintResponse.eid] = sprintResponse;
				this.userStoriesPerSprint[eid] = userStoryResponse.userstories;
				this.allUserStories.push(...this.userStoriesPerSprint[eid].map((userStory) => userStory.eid));
			},
		});
	}

	pullSession() {
		this.planningPokerService.pullSession(this.projectEid, this.currentSession).subscribe({
			next: (result) => {
				console.log("Atualizando...");
				console.log(result);
				this.currentSessionData = result;
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	getCurrentSessionList() {
		this.planningPokerService.getSessions(this.projectEid).subscribe({
			next: (result) => {
				if (result.pokerSessions.length > 0) {
					this.sessionList = true;
				}
				console.log(result.pokerSessions);
				this.allSessionList = result.pokerSessions;
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

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
