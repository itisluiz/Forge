import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";

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
	@Input() acceptanceCriteria: string[] = [];
	@Output() closePopUpEmitter = new EventEmitter<void>();

	testCaseSteps: testCaseStep[] = [
		{ title: "Step 1", action: "", expected: "" },
		{ title: "Step 2", action: "", expected: "" },
		{ title: "Step 3", action: "", expected: "" },
	];

	selected = new FormControl(0);

	popUpActive: boolean = false;

	testCaseForm!: FormGroup;

	creationFailed: boolean = false;
	formSubmitted: boolean = false;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.testCaseForm = this.formBuilder.group({
			acceptanceCriteria: ["", [Validators.required]],
			description: ["", [Validators.required, Validators.minLength(3)]],
			preCondition: ["", [Validators.required, Validators.minLength(3)]],
			steps: this.formBuilder.array([]),
			selectedIndex: 0,
		});

		this.testCaseSteps.forEach((testCaseStep) => {
			this.steps.push(
				this.formBuilder.group({
					action: [testCaseStep.action, [Validators.required, , Validators.minLength(3)]],
					expectedBehavior: [testCaseStep.expected, [Validators.required, , Validators.minLength(3)]],
				}),
			);
		});
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
		const acceptanceCriteria = this.testCaseForm.get("acceptanceCriteria");
		const description = this.testCaseForm.get("description");
		const preCondition = this.testCaseForm.get("preCondition");

		this.formSubmitted = true;
		if (this.testCaseForm.invalid) {
			console.log("Invalid form");
			return;
		}
		if (this.testCaseForm.valid) {
			// TODO: Implementar lógica para criar o test case
			// Se a criação falhar, defina creationFailed como verdadeiro
			console.log("Test case created");
			this.closePopUp();
			this.creationFailed = true;
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
		console.log("Generating test case with AI");
		// TODO - Implementar lógica para gerar test case com AI
		// Obs: Excluir as tabs de testCaseStep default e adicionar as tabs geradas
	}
}
