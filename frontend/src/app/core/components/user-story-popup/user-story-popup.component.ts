import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from "@angular/core";
import {
	AbstractControl,
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
import { UserstoryApiService } from "../../services/userstory-api.service";
import { UserstoryNewRequest } from "forge-shared/dto/request/userstorynewrequest.dto";
import { UserstoryResponse } from "forge-shared/dto/response/userstoryresponse.dto";
import { AcceptanceCriteriaNewRequest } from "forge-shared/dto/request/acceptancecriterianewrequest.dto";
import { Observable } from "rxjs";

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
	@Input() projectEid: string = "";
	@Input() epicEid: string = "";
	@Output() closePopUpEmitter = new EventEmitter<void>();
	@Output() handleUserStoryAndClosePopupEmitter: EventEmitter<UserstoryResponse> = new EventEmitter();
	issueTypes: string[] = ["User Story", "Bug", "New Feature", "Task"];

	popUpActive: boolean = false;

	firstFormGroup!: FormGroup;
	secondFormGroup!: FormGroup;

	creationFailed: boolean = false;
	formSubmitted: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private userstoryApiService: UserstoryApiService,
	) {}

	ngOnInit(): void {
		this.firstFormGroup = this.formBuilder.group({
			summary: ["", Validators.required],
			description: ["", Validators.required],
			asA: ["", Validators.required],
			iWant: ["", Validators.required],
			soThat: ["", Validators.required],
			businessNarrative: ["", Validators.required],
			premisses: ["", Validators.required],
			priority: ["", Validators.required],
		});
		this.secondFormGroup = this.formBuilder.group({
			acceptanceCriteria: this.formBuilder.array([this.initCriteria()]),
		});
	}

	ngOnDestroy(): void {}

	initCriteria(): FormGroup {
		return this.formBuilder.group({
			given: ["", Validators.required],
			when: ["", Validators.required],
			then: ["", Validators.required],
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

	submitSecondForm() {
		this.formSubmitted = true;

		if (this.secondFormGroup.valid && this.firstFormGroup.valid) {
			const userstoryNewRequest = {
				epicEid: this.epicEid,
				title: this.firstFormGroup.get("summary")?.value,
				description: this.firstFormGroup.get("description")?.value,
				narrative: this.firstFormGroup.get("businessNarrative")?.value,
				premisse: this.firstFormGroup.get("premisses")?.value,
				storyActor: this.firstFormGroup.get("asA")?.value,
				storyObjective: this.firstFormGroup.get("iWant")?.value,
				storyJustification: this.firstFormGroup.get("soThat")?.value,
				priority: parseInt(this.firstFormGroup.get("priority")?.value),
			} as UserstoryNewRequest;

			this.createUserStory(userstoryNewRequest).subscribe((userStoryResponse: UserstoryResponse) => {
				const userstoryEid = userStoryResponse.eid;

				const criteriaArray = this.secondFormGroup.get("acceptanceCriteria") as FormArray;

				if (criteriaArray) {
					criteriaArray.controls.forEach((control: AbstractControl) => {
						const criteria = control.value;
						const acceptanceCriteriaNewRequest = {
							userstoryEid: userstoryEid,
							given: criteria.given,
							when: criteria.when,
							then: criteria.then,
						} as AcceptanceCriteriaNewRequest;

						this.createAcceptanceCriteria(acceptanceCriteriaNewRequest).subscribe({
							next: (response) => {
								console.log("Critério de aceitação criado com sucesso:", response);
							},
							error: (error) => {
								console.error("Erro ao criar o critério de aceitação:", error);
							},
						});

						this.handleUserStoryAndClosePopupEmitter.emit(userStoryResponse);
					});
				} else {
					console.error('FormArray "acceptanceCriteria" não encontrado no secondFormGroup');
				}
			});
		}
	}

	createUserStory(userstoryNewRequest: UserstoryNewRequest): Observable<UserstoryResponse> {
		return this.userstoryApiService.newUserstory(userstoryNewRequest, this.projectEid);
	}

	createAcceptanceCriteria(acceptanceCriteriaNewRequest: AcceptanceCriteriaNewRequest) {
		return this.userstoryApiService.newAcceptanceCriteria(acceptanceCriteriaNewRequest, this.projectEid);
	}
}
