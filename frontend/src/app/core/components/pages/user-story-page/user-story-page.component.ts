import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { TestCasePopupComponent } from "../../test-case-popup/test-case-popup.component";

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
	],
	templateUrl: "./user-story-page.component.html",
	styleUrl: "./user-story-page.component.scss",
})
export class UserStoryPageComponent implements OnInit {
	displayedColumns: string[] = ["key", "description", "link"];

	acceptanceCriteria: string[] = [
		"Guest users can click the profile icon in the home page and create an account.",
		"Guest users can proceed to the cart page and create an account.",
		"Guest users can click the wishlist icon against the product to display the wishlist overlay and create an account.",
		"An error message will display if the user enters an existing or invalid email address and other details.",
		"All fields cannot be blank. An error message will display if the user registers with a blank field.",
	];
	testCases = [...TEST_CASES_DATA];

	editModeEnabled: boolean = false;

	popUpActive: boolean = false;

	ngOnInit(): void {}

	enableEditMode() {
		this.editModeEnabled = true;
	}

	disableEditMode() {
		this.editModeEnabled = false;
	}

	openPopUp() {
		this.popUpActive = true;
		document.body.style.overflow = "hidden";
	}

	closePopUp() {
		this.popUpActive = false;
		document.body.style.overflow = "auto";
	}
}
