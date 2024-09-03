import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
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
	],
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {
	@ViewChild("audioPlayer") audioPlayer!: ElementRef<HTMLAudioElement>;
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;
	userPhoto!: string;
	trollando: boolean = false;

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
	) {}

	myControl = new FormControl<string | SearchBar>("");
	options: SearchBar[] = [
		{ name: "Project Epics", route: `/${this.projectEid}/epics` },
		{ name: "Project Backlog", route: `/${this.projectEid}/backlog` },
		{ name: "Sprint Board", route: `/${this.projectEid}/kanban` },
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
	}

	getUser() {
		this.userApiService.self().subscribe((user) => {
			this.userPhoto = user.gravatar;
		});
	}

	displayFn(user: SearchBar): string {
		return user && user.name ? user.name : "";
	}

	navigateTo(route: string) {
		console.log(route);
		this.router.navigate([route]);
	}

	private _filter(name: string): SearchBar[] {
		const filterValue = name.toLowerCase();

		return this.options.filter((option) => option.name.toLowerCase().includes(filterValue));
	}
}
