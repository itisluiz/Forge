import { Component, OnInit } from "@angular/core";
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
	],
	templateUrl: "./user-story-page.component.html",
	styleUrl: "./user-story-page.component.scss",
})
export class UserStoryPageComponent implements OnInit {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;
	userstoryEid: string = this.route.snapshot.paramMap.get("userstoryEid")!;

	displayedColumns: string[] = ["key", "description", "link"];

	acceptanceCriteria: string[] = [
		"Guest users can click the profile icon in the home page and create an account.",
		"Guest users can proceed to the cart page and create an account.",
		"Guest users can click the wishlist icon against the product to display the wishlist overlay and create an account.",
		"An error message will display if the user enters an existing or invalid email address and other details.",
		"All fields cannot be blank. An error message will display if the user registers with a blank field.",
	];
	testCases = [...TEST_CASES_DATA];

	popUpActive: boolean = false;
	popUpEditUserStory: boolean = false;

	userStory$ = this.userstoryApiService.get(this.projectEid, this.userstoryEid);

	acceptanceCriteria$ = this.userstoryApiService.getAcceptanceCriteria(this.projectEid, this.userstoryEid);
	constructor(
		private route: ActivatedRoute,
		private userstoryApiService: UserstoryApiService,
	) {}
	ngOnInit(): void {}

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
}
