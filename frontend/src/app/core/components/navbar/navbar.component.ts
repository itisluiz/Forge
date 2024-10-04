import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { map, Observable, startWith } from "rxjs";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AsyncPipe, CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { ProjectApiService } from "../../services/project-api.service";
import { UserApiService } from "../../services/user-api.service";
import { DeletePopupComponent } from "../delete-popup/delete-popup.component";
import { TokenService } from "../../services/token.service";
import { RolePipe } from "../../pipes/role.pipe";

export interface SearchBar {
	name: string;
	route: string;
}

@Component({
	selector: "app-navbar",
	standalone: true,
	imports: [
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatSidenavModule,
		MatAutocompleteModule,
		MatInputModule,
		MatFormFieldModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AsyncPipe,
		MatMenuModule,
		DeletePopupComponent,
		RolePipe,
	],
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {
	@ViewChild("audioPlayer") audioPlayer!: ElementRef<HTMLAudioElement>;
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;
	userPhoto!: string;
	userEid!: string;
	projectMembersMap: Record<string, ProjectMemberComposite> = {};
	trollando: boolean = false;
	popUpLeaveForge: boolean = false;
	activeRoute: string = localStorage.getItem("activeRoute") || "";

	playAudio() {
		if ((this.trollando = !this.trollando)) {
			this.audioPlayer.nativeElement.play();
		} else {
			this.audioPlayer.nativeElement.pause();
		}
	}

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private userApiService: UserApiService,
		private tokenService: TokenService,
		private projectApiService: ProjectApiService,
	) {}

	myControl = new FormControl<string | SearchBar>("");
	options: SearchBar[] = [
		{ name: "Project Epics", route: `/${this.projectEid}/epics` },
		{ name: "Project Backlog", route: `/${this.projectEid}/backlog` },
		{ name: "Sprint Board", route: `/${this.projectEid}/kanban` },
		{ name: "Planning Poker", route: `/${this.projectEid}/planning-poker` },
		{ name: "Home", route: `/${this.projectEid}/sprint-details` },
	];

	filteredOptions!: Observable<SearchBar[]>;

	ngOnInit() {
		this.getUser();

		this.filteredOptions = this.myControl.valueChanges.pipe(
			startWith(""),
			map((value) => {
				const name = typeof value === "string" ? value : value?.name;
				return name ? this._filter(name as string) : this.options.slice();
			}),
		);

		this.getProject()
			.pipe(
				map((project) => {
					project.members.forEach((member) => {
						this.projectMembersMap[member.eid] = member;
					});
				}),
			)
			.subscribe();

		this.setActiveRoute(this.activeRoute);
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
			this.userPhoto = user.gravatar;
			this.userEid = user.eid;
		});
	}

	displayFn(user: SearchBar): string {
		return user && user.name ? user.name : "";
	}

	setActiveRoute(route: string) {
		if (route === this.options[0].route) {
			this.activeRoute = "epics";
		}
		if (route === this.options[1].route) {
			this.activeRoute = "backlog";
		}
		if (route === this.options[2].route) {
			this.activeRoute = "sprint";
		}
		if (route === this.options[3].route) {
			this.activeRoute = "planning-poker";
		}
		if (route === this.options[4].route) {
			this.activeRoute = "home";
		}
		localStorage.setItem("activeRoute", this.activeRoute);
		this.activeRoute = localStorage.getItem("activeRoute") || this.activeRoute;
	}

	navigateTo(route: string) {
		const storedRoute = localStorage.getItem("activeRoute");
		if (storedRoute) {
			this.activeRoute = storedRoute;
		}

		this.router.navigate([route]);
		this.setActiveRoute(route);
	}

	openPopUp(popUp: string) {
		if (popUp === "leaveConfirm") {
			this.popUpLeaveForge = true;
		}
	}

	closePopUp(popUp: string) {
		if (popUp === "leaveConfirm") {
			this.popUpLeaveForge = false;
		}
	}

	leaveProject() {
		this.router.navigate(["/select-project"]);
	}

	leaveForge() {
		this.tokenService.delete();
		this.router.navigate(["/login"]);
	}

	private _filter(name: string): SearchBar[] {
		const filterValue = name.toLowerCase();

		return this.options.filter((option) => option.name.toLowerCase().includes(filterValue));
	}
}
