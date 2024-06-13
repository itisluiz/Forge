import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { UserStory } from "forge-shared/dto/userstory.dto";
import { NewTestCase } from "forge-shared/dto/newtestcase.dto";
import { AITestCase } from "forge-shared/dto/aitestcase.dto";

export interface testCase {
	description: string;
	precondition: string;
	steps: Array<{ action: string; expected: string }>;
}

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
		RouterModule,
		FormsModule,
	],
	templateUrl: "./user-story-page.component.html",
	styleUrl: "./user-story-page.component.scss",
})
export class UserStoryPageComponent implements OnInit {
	displayedColumns: string[] = ["key", "title"];

	public story = { title: "", description: "", actor: "", objective: "", justification: "" };

	public testCreationForm = { acceptanceCriteria: "", title: "", newStep: "", steps: [] as string[] };

	public acceptanceCriteria: { id: number; given: string; when: string; then: string }[] = [];
	//testCases = [...TEST_CASES_DATA];
	testCases: any[] = [];

	createTestCaseForm!: FormGroup;
	creationFailed: boolean = false;
	formSubmitted: boolean = false;

	popUpActive: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private apiService: ApiService,
	) {}

	public addTestStep() {
		this.testCreationForm.steps.push(this.testCreationForm.newStep);
		this.testCreationForm.newStep = "";
	}

	ngOnInit(): void {
		this.createTestCaseForm = this.formBuilder.group({
			acceptanceCriteria: ["", [Validators.required, Validators.minLength(3)]],
			description: ["", [Validators.required, Validators.minLength(3)]],
			preCondition: ["", [Validators.required, Validators.minLength(3)]],
		});

		this.apiService.call<UserStory>("GET", "userstory").subscribe((response) => {
			this.story.title = response.title;
			this.story.description = response.description;
			this.story.actor = response.actor;
			this.story.objective = response.objective;
			this.story.justification = response.justification;

			this.acceptanceCriteria = response.acceptanceCriteria.map((ac) => ({
				id: ac.id,
				given: ac.given,
				when: ac.when,
				then: ac.then,
			}));

			this.testCases = response.acceptanceCriteria.flatMap((ac) =>
				ac.tests.map((tc) => ({
					acceptanceCriteria: ac.id.toString(),
					title: tc.title,
					steps: tc.steps,
				})),
			);

			console.log(this.testCases);

			this.testCreationForm.acceptanceCriteria = this.acceptanceCriteria[0].id.toString();
		});
	}

	public generateAITestCase() {
		this.testCreationForm = {
			acceptanceCriteria: this.testCreationForm.acceptanceCriteria,
			title: "",
			newStep: "",
			steps: [] as string[],
		};

		this.apiService
			.call<AITestCase>("GET", "aitestcase", { acID: this.testCreationForm.acceptanceCriteria })
			.subscribe((res) => {
				this.testCreationForm.title = res.title;
				this.testCreationForm.steps = res.steps;
			});
	}

	createTestCase() {
		if (
			this.testCreationForm.steps.length === 0 ||
			!this.testCreationForm.title ||
			!this.testCreationForm.acceptanceCriteria
		) {
			alert("Fill all the fields");
			return;
		}

		let newTestCase = {} as NewTestCase;
		newTestCase.acceptanceCriteriaId = parseInt(this.testCreationForm.acceptanceCriteria);
		newTestCase.title = this.testCreationForm.title;
		newTestCase.steps = this.testCreationForm.steps;

		this.apiService.call("POST", "addtestcase", undefined, newTestCase).subscribe((res) => {
			alert("Test case created");
			this.closePopUp();
		});
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
		this.testCreationForm = {
			acceptanceCriteria: this.acceptanceCriteria.length > 0 ? this.acceptanceCriteria[0].id.toString() : "",
			title: "",
			newStep: "",
			steps: [] as string[],
		};

		this.ngOnInit();
		this.createTestCaseForm.reset();
		this.popUpActive = false;
		document.body.style.overflow = "auto";
	}
}
