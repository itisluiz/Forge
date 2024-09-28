import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
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
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { forkJoin, map, Observable } from "rxjs";
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
import { PlanningpokerSetuserstoryRequest } from "forge-shared/dto/request/planningpokersetuserstoryrequest.dto";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";
import { PlanningpokerVoteRequest } from "forge-shared/dto/request/planningpokervoterequest.dto";
import { PokerScorePipe } from "../../../pipes/pokerscore.pipe";
import { SelectComponent } from "../../select-component/select-component";
import { FormsModule } from "@angular/forms";
import { RolePipe } from "../../../pipes/role.pipe";
import { UserApiService } from "../../../services/user-api.service";
import { Priority } from "forge-shared/enum/priority.enum";
import { MatTooltipModule } from "@angular/material/tooltip";

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
		PokerScorePipe,
		SelectComponent,
		FormsModule,
		RolePipe,
		MatTooltipModule,
		MatRippleModule,
	],
	templateUrl: "./planning-poker-page.component.html",
	styleUrl: "./planning-poker-page.component.scss",
})
export class PlanningPokerPageComponent implements OnInit, OnDestroy {
	@ViewChildren("expand") expand!: QueryList<ElementRef>;
	@ViewChild("pokerSubject") pokerSubject!: InputComponent;
	@ViewChild("userStoriesSprint") userStoriesSprint!: SelectComponent;

	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;

	scoreToggle: boolean = false;
	expandToggle: boolean = true;
	activeCard: number | null | undefined;

	inSession: boolean = false;
	sessionList: boolean = false;
	userStorySetted: boolean = false;
	userEid!: string;

	allSessionList: PlanningpokerSelfComposite[] = [];
	votedCount: number = 0;

	selectedSprintEid: string = "";

	currentSession: string = "";
	currentSessionData: PlanningpokerResponse = {} as PlanningpokerResponse;

	currentUserstoryBeingVoted?: UserstoryResponse;

	popUpCreateSession: boolean = false;
	projectMembersMap: Record<string, ProjectMemberComposite> = {};
	projectCode: string = "";
	currentSprint: SprintSelfComposite = {} as SprintSelfComposite;
	allSprints: SprintSelfComposite[] = [];
	allUserStories: string[] = [];
	currentAndFutureSprints: SprintSelfComposite[] = [];
	detailedSprints: { [key: string]: SprintResponse } = {};
	userStoriesPerSprint: { [key: string]: UserstorySelfComposite[] } = {};
	private sessionIntervalId: any;

	constructor(
		private route: ActivatedRoute,
		private projectApiService: ProjectApiService,
		private planningPokerService: PlanningPokerService,
		private userStoryApiService: UserstoryApiService,
		private sprintApiService: SprintApiService,
		private userApiService: UserApiService,
		private router: Router,
	) {}

	switchSession() {
		this.inSession = !this.inSession;
	}

	ngOnInit(): void {
		this.getUser();
		this.loadSprintData();
		this.getCurrentSessionList();

		this.getProject()
			.pipe(
				map((project) => {
					this.projectCode = project.code;
					project.members.forEach((member) => {
						this.projectMembersMap[member.eid] = member;
					});
				}),
			)
			.subscribe();
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
		const createRequest: PlanningpokerCreatesessionRequest = {
			agenda: this.pokerSubject.value,
			sprintEid: this.selectedSprintEid,
		};

		this.planningPokerService.createSession(createRequest, this.projectEid).subscribe({
			next: (result) => {
				this.currentSession = result.sessionCode;
				this.inSession = true;
				this.popUpCreateSession = false;
				this.router.navigate([`/planning-poker/${this.projectEid}/${result.sessionCode}`]);
				this.pullSession();

				this.sessionIntervalId = setInterval(() => {
					this.pullSession();
				}, 2000);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	vote(userScore: number | null) {
		this.pullSession();
		this.setActiveCard(userScore);

		const voteRequest: PlanningpokerVoteRequest = {
			vote: userScore,
		};

		this.planningPokerService.setVote(voteRequest, this.projectEid, this.currentSession).subscribe({
			next: (result) => {
				console.log("score" + userScore);
			},
			error: (error) => {
				console.error(error);
				this.setActiveCard(undefined);
			},
		});
	}

	setUserStory(userStoryEid: string) {
		this.pullSession();

		const setUserstoryRequest: PlanningpokerSetuserstoryRequest = {
			userstoryEid: userStoryEid,
		};

		this.planningPokerService.setUserstory(setUserstoryRequest, this.projectEid, this.currentSession).subscribe({
			next: (result) => {
				this.activeCard = undefined;
				this.getEspecificUserstory(userStoryEid);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	loadSprintData() {
		this.sprintApiService.self(this.projectEid).subscribe({
			next: (sprintSelfResponse) => {
				// Load all Sprints
				this.allSprints = sprintSelfResponse.sprints;

				// Load current and future Sprints
				this.currentAndFutureSprints = this.allSprints.filter(
					(sprint) =>
						sprint.periodStatus === SprintPeriodStatus.ONGOING || sprint.periodStatus === SprintPeriodStatus.FUTURE,
				);

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
				this.currentSessionData.userstories.sort((a, b) => b.priority - a.priority);
				this.votedCount = this.currentSessionData.participants.filter((x) => x.vote !== undefined).length;

				if (result.selectedUserstoryEid) {
					this.getEspecificUserstory(result.selectedUserstoryEid!);
				}
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	saveResult() {
		this.pullSession();

		const voteRequest: PlanningpokerVoteRequest = {
			vote: this.activeCard,
		};

		this.planningPokerService.saveResult(voteRequest, this.projectEid, this.currentSession).subscribe({
			next: (result) => {
				console.log("Saving result...");
				console.log(this.currentSessionData);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	revealVotes() {
		this.pullSession();

		this.planningPokerService.revealVotes(this.projectEid, this.currentSession).subscribe({
			next: (result) => {
				console.log("Revealing votes...");
				console.log(this.currentSessionData);
				this.saveResult();
			},
			error: (error) => {
				console.error(error);
			},
		});
		this.setScoreToggle();
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

	getEspecificUserstory(userStoryEid: string): void {
		this.userStoryApiService.get(this.projectEid, userStoryEid).subscribe({
			next: (userStory) => {
				this.currentUserstoryBeingVoted = userStory;
			},
			error: (error) => {
				console.error(error);
			},
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

	setActiveCard(cardValue: number | null | undefined) {
		this.activeCard = cardValue;
	}

	navigateToCurrentUserStory(userStoryEid: string) {
		const url = this.router.serializeUrl(this.router.createUrlTree([`/${this.projectEid}/${userStoryEid}/user-story`]));
		window.open(url, "_blank");
	}

	getProject(): Observable<ProjectResponse> {
		return this.projectApiService.getEspecificProject(this.projectEid);
	}

	getProjectMemberFromMap(userEid: string | undefined): ProjectMemberComposite | null {
		if (!userEid) return null;
		return this.projectMembersMap[userEid] || null;
	}

	getUser() {
		this.userApiService.self().subscribe((user) => {
			this.userEid = user.eid;
		});
	}

	quitSession() {
		this.inSession = false;
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
