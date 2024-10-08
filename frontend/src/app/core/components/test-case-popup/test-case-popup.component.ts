import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { TestCaseService } from "../../services/test-case.service";
import { ActivatedRoute } from "@angular/router";
import { TestcaseStepComposite } from "forge-shared/dto/composite/testcasestepcomposite.dto";
import { TestcaseNewRequest } from "forge-shared/dto/request/testcasenewrequest.dto";
import { AcceptanceCriteriaSelfComposite } from "forge-shared/dto/composite/acceptancecriteriaselfcomposite.dto";
import { AcceptanceCriteriaSelfResponse } from "forge-shared/dto/response/acceptancecriteriaselfresponse.dto";
import { TestcaseResponse } from "forge-shared/dto/response/testcaseresponse.dto";
import { AcceptanceCriteriaService } from "../../services/acceptance-criteria.service";
import { TestcaseUpdateRequest } from "forge-shared/dto/request/testcaseupdaterequest.dto";
import { TestcaseSuggestionRequest } from "forge-shared/dto/request/testcasesuggestionrequest.dto";
import { finalize } from "rxjs";

// TODO [TestCaseStep] - Remover isso quando DTO for criado
export interface testCaseStep {
	title: string;
	action: string;
	expected: string;
}

@Component({
	selector: "app-test-case-popup",
	standalone: true,
	imports: [CommonModule, MatTabsModule, MatIcon, MatFormFieldModule, ReactiveFormsModule],
	templateUrl: "./test-case-popup.component.html",
	styleUrl: "./test-case-popup.component.scss",
})
export class TestCasePopupComponent implements OnInit {
	@Input() acceptanceCriteria!: AcceptanceCriteriaSelfResponse;
	@Input() testCaseEditData!: TestcaseResponse;
	@Input() isEditMode: boolean = false;
	@Output() closePopUpEmitter = new EventEmitter<void>();
	@Output() updateTestCaseEmitter = new EventEmitter<void>();

	isAIThinking: boolean = false;

	testCaseSteps: testCaseStep[] = [
		{ title: "Step 1", action: "", expected: "" },
		{ title: "Step 2", action: "", expected: "" },
		{ title: "Step 3", action: "", expected: "" },
	];

	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;
	testcaseEid: string = this.route.snapshot.paramMap.get("testcaseEid")!;

	selected = new FormControl(0);

	popUpActive: boolean = false;

	testCaseForm!: FormGroup;

	creationFailed: boolean = false;
	updateFailed: boolean = false;
	formSubmitted: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private testCaseService: TestCaseService,
		private acceptanceCriteriaService: AcceptanceCriteriaService,
	) {}

	ngOnInit(): void {
		this.testCaseForm = this.formBuilder.group({
			acceptanceCriteria: ["", [Validators.required]],
			description: ["", [Validators.required, Validators.minLength(3)]],
			preCondition: ["", [Validators.required, Validators.minLength(3)]],
			steps: this.formBuilder.array([]),
			selectedIndex: 0,
		});

		this.updateValuesPopUp();

		if (!this.isEditMode) {
			this.testCaseSteps.forEach((testCaseStep) => {
				this.steps.push(
					this.formBuilder.group({
						action: [testCaseStep.action, [Validators.required, , Validators.minLength(3)]],
						expectedBehavior: [testCaseStep.expected, [Validators.required, , Validators.minLength(3)]],
					}),
				);
			});
		}
	}

	isControlInvalid(field: string, index?: number): boolean {
		let control;
		if (index !== undefined) {
			control = this.steps.at(index).get(field);
		} else {
			control = this.testCaseForm.get(field);
		}
		return control ? control.invalid && (control.dirty || control.touched) : false;
	}

	updateValuesPopUp() {
		if (this.isEditMode) {
			this.testCaseForm.patchValue({
				acceptanceCriteria: this.testCaseEditData.acceptancecriteriaEid,
				description: this.testCaseEditData.description,
				preCondition: this.testCaseEditData.precondition,
			});
			this.testCaseEditData.steps.forEach((step: TestcaseStepComposite) => {
				this.steps.push(
					this.formBuilder.group({
						action: [step.action, [Validators.required, Validators.minLength(3)]],
						expectedBehavior: [step.expectedBehavior, [Validators.required, Validators.minLength(3)]],
					}),
				);
			});
		}
	}

	closePopUp() {
		this.testCaseForm.reset();
		this.closePopUpEmitter.emit();
	}

	get steps(): FormArray {
		return this.testCaseForm.get("steps") as FormArray;
	}

	get criteriaErrorMessage(): string {
		if (this.testCaseForm.get("acceptanceCriteria")!.errors) {
			return "You must select a acceptance criteria.";
		}
		return "";
	}

	get descriptionErrorMessage(): string {
		if (this.testCaseForm.get("description")!.errors) {
			return "Description must have at least 3 characters.";
		}
		return "";
	}

	get actionErrorMessage(): string {
		if (this.testCaseForm.get("description")!.errors) {
			return "Action must have at least 3 characters.";
		}
		return "";
	}

	get expectedErrorMessage(): string {
		if (this.testCaseForm.get("description")!.errors) {
			return "Expected behavior must have at least 3 characters.";
		}
		return "";
	}

	createTestCase() {
		const newTestCaseRequest: TestcaseNewRequest = {
			acceptancecriteriaEid: this.testCaseForm.get("acceptanceCriteria")?.value,
			description: this.testCaseForm.get("description")?.value,
			precondition: this.testCaseForm.get("preCondition")?.value,
			steps: this.testCaseForm.get("steps")?.value,
		};

		console.log("Criando Test Case com as informações: ", newTestCaseRequest);

		this.formSubmitted = true;
		if (this.testCaseForm.invalid) {
			console.log("Invalid form");
			return;
		}
		if (this.testCaseForm.valid) {
			// TODO: Implementar lógica para criar o test case
			// Se a criação falhar, defina creationFailed como verdadeiro
			this.testCaseService.createTestCase(newTestCaseRequest, this.projectEid).subscribe({
				next: (data) => {
					console.log(data);
					this.closePopUpEmitter.emit();
				},
				error: (error) => {
					console.error(error);
				},
			});
			console.log("Test case created");
			this.closePopUp();
			this.creationFailed = true;
		}
	}

	updateTestCase() {
		const updateTestCaseRequest: TestcaseUpdateRequest = {
			description: this.testCaseForm.get("description")?.value,
			precondition: this.testCaseForm.get("preCondition")?.value,
			steps: this.testCaseForm.get("steps")?.value,
		};

		console.log("Criando Test Case com as informações: ", updateTestCaseRequest);

		this.formSubmitted = true;
		if (this.testCaseForm.invalid) {
			console.log("Invalid form");
			return;
		}
		if (this.testCaseForm.valid) {
			// TODO: Implementar lógica para criar o test case
			// Se a criação falhar, defina creationFailed como verdadeiro
			this.testCaseService.updateTestCase(updateTestCaseRequest, this.projectEid, this.testcaseEid).subscribe({
				next: (data) => {
					console.log(data);
					this.closePopUpEmitter.emit();
				},
				error: (error) => {
					console.error(error);
				},
			});
			console.log("Test case created");
			this.closePopUp();
			this.updateFailed = true;
		}
	}

	addTab() {
		this.testCaseSteps.push({
			title: "Step " + (this.testCaseSteps.length + 1),
			action: "Action " + (this.testCaseSteps.length + 1),
			expected: "Expected Result " + (this.testCaseSteps.length + 1),
		});
		this.steps.push(this.formBuilder.group({ action: [""], expectedBehavior: [""] }));
		this.selected.setValue(this.testCaseSteps.length - 1);
	}

	deleteTab() {
		console.log("deleting");
		if (this.testCaseSteps.length === 1) {
			return;
		}
		this.testCaseSteps.splice(this.selected.value!, 1);
		this.steps.removeAt(this.selected.value!);
		for (let i = 0; i < this.testCaseSteps.length; i++) {
			this.testCaseSteps[i].title = "Step " + (i + 1);
		}
	}

	generateWithAI() {
		this.isAIThinking = true;

		let suggestionRequest: TestcaseSuggestionRequest = {
			acceptancecriteriaEid: this.testCaseForm.get("acceptanceCriteria")?.value,
			prompt: undefined,
		};

		this.testCaseService
			.getSuggestion(suggestionRequest, this.projectEid)
			.pipe(
				finalize(() => {
					this.isAIThinking = false;
				}),
			)
			.subscribe({
				next: (data) => {
					console.log(data);

					this.testCaseForm.patchValue({
						description: data.description,
						preCondition: data.precondition,
					});

					this.testCaseForm.setControl("steps", this.formBuilder.array([]));
					data.steps.forEach((step: TestcaseStepComposite) => {
						this.steps.push(
							this.formBuilder.group({
								action: [step.action],
								expectedBehavior: [step.expectedBehavior],
							}),
						);
					});

					this.testCaseSteps = data.steps.map((step: TestcaseStepComposite, index: number) => {
						return {
							title: "Step " + (index + 1),
							action: step.action,
							expected: step.expectedBehavior,
						};
					});
				},
				error: (error) => {
					console.error;
				},
			});
	}
}
