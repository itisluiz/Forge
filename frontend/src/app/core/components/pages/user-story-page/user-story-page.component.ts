import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ApiService } from "../../../services/api.service";

export interface History {
	key: string;
	description: string;
	link: string;
}

export interface testCase {
	description: string;
	precondition: string;
	steps: Array<{ action: string; expected: string }>;
}

const TEST_CASES_DATA: History[] = [
	{
		key: "FEA-001",
		description: "Guest user can create an account from the homepage",
		link: "Low",
	},
	{
		key: "FEA-002",
		description: "Guest user can create an account from the homepage",
		link: "Medium",
	},
	{
		key: "FEA-003",
		description: "Guest user can create an account from the homepage",
		link: "Medium",
	},
	{
		key: "FEA-004",
		description: "Guest user can create an account from the homepage",
		link: "High",
	},
];

@Component({
	selector: "app-user-story-page",
	standalone: true,
	imports: [
		NavbarComponent,
		MatIcon,
		MatExpansionModule,
		MatTable,
		MatTableModule,
		MatSelectModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		CommonModule,
	],
	templateUrl: "./user-story-page.component.html",
	styleUrl: "./user-story-page.component.scss",
})
export class UserStoryPageComponent implements OnInit {
	displayedColumns: string[] = ["key", "description", "link"];

	//testCases = [...TEST_CASES_DATA];
	testCases: History[] = [];

	createTestCaseForm!: FormGroup;
	creationFailed: boolean = false;
	formSubmitted: boolean = false;

	editModeEnabled: boolean = false;

	popUpActive: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private api: ApiService,
	) {}

	ngOnInit(): void {
		this.createTestCaseForm = this.formBuilder.group({
			acceptanceCriteria: ["", [Validators.required, Validators.minLength(3)]],
			description: ["", [Validators.required, Validators.minLength(3)]],
			preCondition: ["", [Validators.required, Validators.minLength(3)]],
			action1: ["", [Validators.required, Validators.minLength(3)]],
			behavior1: ["", [Validators.required, Validators.minLength(3)]],
			action2: ["", [Validators.required, Validators.minLength(3)]],
			behavior2: ["", [Validators.required, Validators.minLength(3)]],
			action3: ["", [Validators.required, Validators.minLength(3)]],
			behavior3: ["", [Validators.required, Validators.minLength(3)]],
		});
	}

	enableEditMode() {
		this.editModeEnabled = true;
	}

	disableEditMode() {
		this.editModeEnabled = false;
	}

	async onGenerateWithAI() {
		let acceptanceCriteria = this.getAcceptanceCriteria();
		this.api.call("post", "testcaseai", undefined, { acceptanceCriteria }).subscribe((obj) => {
			this.populateFromObject(obj as testCase);
		});
	}

	getAcceptanceCriteria(): string {
		return this.createTestCaseForm.get("acceptanceCriteria")!.value;
	}

	populateFromObject(data: testCase): void {
		console.log(data);
		this.createTestCaseForm.get("description")!.setValue(data["description"]);
		this.createTestCaseForm.get("preCondition")!.setValue(data["precondition"]);
		this.createTestCaseForm.get("action1")!.setValue(data.steps[0].action);
		this.createTestCaseForm.get("behavior1")!.setValue(data.steps[0].expected);
		this.createTestCaseForm.get("action2")!.setValue(data.steps[1].action);
		this.createTestCaseForm.get("behavior2")!.setValue(data.steps[1].expected);
		this.createTestCaseForm.get("action3")!.setValue(data.steps[2].action);
		this.createTestCaseForm.get("behavior3")!.setValue(data.steps[2].expected);
	}

	createTestCase() {
		const acceptanceCriteria = this.createTestCaseForm.get("acceptanceCriteria");
		const description = this.createTestCaseForm.get("description");
		const preCondition = this.createTestCaseForm.get("preCondition");

		this.formSubmitted = true;
		if (this.createTestCaseForm.invalid && (acceptanceCriteria?.value.length === 0 || description?.value.length === 0)) {
			console.log("Invalid form");
			return;
		}
		if (this.createTestCaseForm.valid) {
			// Lógica para criação do test case aqui
			// Se a criação falhar, defina creationFailed como verdadeiro
			console.log("Test case created");
			this.closePopUp();
			this.creationFailed = true;
		}
	}

	isTextInvalid(field: string): boolean {
		const fieldText = this.createTestCaseForm.get(field);
		if (!fieldText?.value) {
			return false;
		}
		if (fieldText?.value.length === 0) {
			return false;
		}
		return fieldText!.invalid && (fieldText!.dirty || fieldText!.touched);
	}

	get nameErrorMessage(): string {
		if (this.createTestCaseForm.get("acceptanceCriteria")!.errors) {
			return "Criteria must have at least 3 characters.";
		}
		return "";
	}

	get descriptionErrorMessage(): string {
		if (this.createTestCaseForm.get("description")!.errors) {
			return "Description must have at least 3 characters.";
		}
		return "";
	}

	createTestCaseManually() {
		console.log("Creating test cases manually");
		this.popUpActive = true;
		document.body.style.overflow = "hidden";
	}

	closePopUp() {
		this.createTestCaseForm.reset();
		this.popUpActive = false;
		document.body.style.overflow = "auto";
	}

	createTestCaseIA() {
		// TODO: Implement IA logic to create test cases
		console.log("Creating test cases with IA");
	}
}