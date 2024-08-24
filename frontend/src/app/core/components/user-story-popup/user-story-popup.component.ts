import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from "@angular/core";
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";
import { Subscription } from "rxjs";

@Component({
	selector: "app-user-story-popup",
	standalone: true,
	imports: [
		CommonModule,
		MatTabsModule,
		MatIcon,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatStepperModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
	templateUrl: "./user-story-popup.component.html",
	styleUrl: "./user-story-popup.component.scss",
})
export class UserStoryPopupComponent implements OnInit, OnDestroy {
	@Input() epics: string[] = [];
	@Output() closePopUpEmitter = new EventEmitter<void>();

	issueTypes: string[] = ["User Story", "Bug", "New Feature", "Task"];

	popUpActive: boolean = false;

	firstFormGroup!: FormGroup;
	secondFormGroup!: FormGroup;

	creationFailed: boolean = false;
	formSubmitted: boolean = false;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.firstFormGroup = this.formBuilder.group({
			summary: ["", Validators.required],
			description: ["", Validators.required],
			asA: ["", Validators.required],
			iWant: ["", Validators.required],
			soThat: ["", Validators.required],
			businessNarrative: ["", Validators.required],
			premisses: ["", Validators.required],
		});
		this.secondFormGroup = this.formBuilder.group({
			acceptanceCriteria: this.formBuilder.array([this.initCriteria()]),
		});
	}

	ngOnDestroy(): void {}

	initCriteria(): FormGroup {
		return this.formBuilder.group({
			criterion: ["", Validators.required],
		});
	}

	get criteriaInputs(): FormArray {
		return this.secondFormGroup.get("acceptanceCriteria") as FormArray;
	}

	addCriteria(): void {
		this.criteriaInputs.push(this.initCriteria());
	}

	removeCriteria(index: number) {
		this.criteriaInputs.removeAt(index);
	}

	closePopUp() {
		this.secondFormGroup.reset();
		this.firstFormGroup.reset();
		this.closePopUpEmitter.emit();
	}
}
