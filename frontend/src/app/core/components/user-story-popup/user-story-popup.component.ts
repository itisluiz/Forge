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
import { AcceptanceCriteriaSelfResponse } from "forge-shared/dto/response/acceptancecriteriaselfresponse.dto";
import { AcceptanceCriteriaSelfComposite } from "forge-shared/dto/composite/acceptancecriteriaselfcomposite.dto";
import { UserstoryUpdateRequest } from "forge-shared/dto/request/userstoryupdaterequest.dto";
import { AcceptanceCriteriaUpdateRequest } from "forge-shared/dto/request/acceptancecriteriaupdaterequest.dto";

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
	@Input() isEditMode: boolean = false;
	@Input() projectEid: string = "";
	@Input() epicEid: string = "";
	@Input() userStoryEditData$: Observable<UserstoryResponse> = new Observable();
	@Input() criteriaEditData$: Observable<AcceptanceCriteriaSelfResponse> = new Observable();
	@Output() closePopUpEmitter = new EventEmitter<void>();
	@Output() handleUserStoryAndClosePopupEmitter: EventEmitter<UserstoryResponse> = new EventEmitter();
	@Output() handleEditedUserStoryAndClosePopupEmitter: EventEmitter<void> = new EventEmitter();

	issueTypes: string[] = ["User Story", "Bug", "New Feature", "Task"];

	popUpActive: boolean = false;

	firstFormGroup!: FormGroup;
	secondFormGroup!: FormGroup;

	creationFailed: boolean = false;
	formSubmitted: boolean = false;

	userStoryEid: string = "";

	disableButtonDuringRequest: boolean = false;

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
			priority: ["1", Validators.required],
		});
		this.secondFormGroup = this.formBuilder.group({
			acceptanceCriteria: this.formBuilder.array([this.initCriteria()]),
		});
		if (this.isEditMode) {
			this.userStoryEditData$.subscribe((userStoryData) => {
				this.userStoryEid = userStoryData.eid;
				this.firstFormGroup.get("summary")?.setValue(userStoryData.title);
				this.firstFormGroup.get("description")?.setValue(userStoryData.description);
				this.firstFormGroup.get("asA")?.setValue(userStoryData.storyActor);
				this.firstFormGroup.get("iWant")?.setValue(userStoryData.storyObjective);
				this.firstFormGroup.get("soThat")?.setValue(userStoryData.storyJustification);
				this.firstFormGroup.get("businessNarrative")?.setValue(userStoryData.narrative);
				this.firstFormGroup.get("premisses")?.setValue(userStoryData.premisse);
				this.firstFormGroup.get("priority")?.setValue(userStoryData.priority);
			});
			this.criteriaEditData$.subscribe((criteriaData) => {
				this.criteriaInputs.clear();
				criteriaData.acceptanceCriteria.forEach((criteria) => {
					this.criteriaInputs.push(this.initCriteriaWithValues(criteria));
				});
			});
		}
	}

	ngOnDestroy(): void {}

	initCriteria(): FormGroup {
		return this.formBuilder.group({
			given: ["", Validators.required],
			when: ["", Validators.required],
			then: ["", Validators.required],
		});
	}

	initCriteriaWithValues(criteria: AcceptanceCriteriaSelfComposite): FormGroup {
		return this.formBuilder.group({
			criteriaEid: [criteria.eid],
			given: [criteria.given, Validators.required],
			when: [criteria.when, Validators.required],
			then: [criteria.then, Validators.required],
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
		this.disableButtonDuringRequest = true;
		this.formSubmitted = true;

		if (this.secondFormGroup.valid && this.firstFormGroup.valid) {
			if (!this.isEditMode) {
				const userstoryNewRequest = this.buildUserStoryNewRequest();
				this.handleCreateUserStory(userstoryNewRequest);
			} else {
				const userstoryUpdateRequest = this.buildUserStoryUpdateRequest();
				this.handleUpdateUserStory(userstoryUpdateRequest);
			}
		}
	}

	private buildUserStoryNewRequest(): UserstoryNewRequest {
		return {
			epicEid: this.epicEid,
			title: this.firstFormGroup.get("summary")?.value,
			description: this.firstFormGroup.get("description")?.value,
			narrative: this.firstFormGroup.get("businessNarrative")?.value,
			premisse: this.firstFormGroup.get("premisses")?.value,
			storyActor: this.firstFormGroup.get("asA")?.value,
			storyObjective: this.firstFormGroup.get("iWant")?.value,
			storyJustification: this.firstFormGroup.get("soThat")?.value,
			priority: parseInt(this.firstFormGroup.get("priority")?.value),
		};
	}

	private buildUserStoryUpdateRequest(): UserstoryUpdateRequest {
		return {
			title: this.firstFormGroup.get("summary")?.value,
			description: this.firstFormGroup.get("description")?.value,
			narrative: this.firstFormGroup.get("businessNarrative")?.value,
			premisse: this.firstFormGroup.get("premisses")?.value,
			storyActor: this.firstFormGroup.get("asA")?.value,
			storyObjective: this.firstFormGroup.get("iWant")?.value,
			storyJustification: this.firstFormGroup.get("soThat")?.value,
			priority: parseInt(this.firstFormGroup.get("priority")?.value),
		};
	}

	private handleCreateUserStory(userstoryNewRequest: UserstoryNewRequest) {
		this.createUserStory(userstoryNewRequest).subscribe((userStoryResponse: UserstoryResponse) => {
			this.disableButtonDuringRequest = false;
			this.processAcceptanceCriteria(userStoryResponse.eid);
			this.handleUserStoryAndClosePopupEmitter.emit(userStoryResponse);
		});
	}

	private handleUpdateUserStory(userstoryUpdateRequest: UserstoryUpdateRequest) {
		this.updateUserStory(userstoryUpdateRequest).subscribe(() => {
			this.processAcceptanceCriteria(this.userStoryEid, true);
			this.handleEditedUserStoryAndClosePopupEmitter.emit();
		});
	}

	private processAcceptanceCriteria(userstoryEid: string, isEditMode: boolean = false) {
		const criteriaArray = this.secondFormGroup.get("acceptanceCriteria") as FormArray;

		if (criteriaArray) {
			const existingCriteriaEids = new Set<string>(); // Para armazenar critérios existentes
			const newCriteria: AcceptanceCriteriaNewRequest[] = []; // Para armazenar novos critérios

			criteriaArray.controls.forEach((control: AbstractControl) => {
				const criteria = control.value;
				if (criteria.criteriaEid) {
					existingCriteriaEids.add(criteria.criteriaEid);
				} else {
					// Critérios novos
					newCriteria.push({
						userstoryEid: userstoryEid,
						given: criteria.given,
						when: criteria.when,
						then: criteria.then,
					});
				}
			});

			if (isEditMode) {
				this.updateExistingCriteria(existingCriteriaEids, userstoryEid);
			}
			this.createNewCriteria(newCriteria, userstoryEid);
		} else {
			console.error('FormArray "acceptanceCriteria" não encontrado no secondFormGroup');
		}
	}

	private updateExistingCriteria(existingCriteriaEids: Set<string>, userstoryEid: string) {
		const criteriaArray = this.secondFormGroup.get("acceptanceCriteria") as FormArray;

		criteriaArray.controls.forEach((control: AbstractControl) => {
			const criteria = control.value;
			if (criteria.criteriaEid) {
				const acceptanceCriteriaUpdateRequest: AcceptanceCriteriaUpdateRequest = {
					given: criteria.given,
					when: criteria.when,
					then: criteria.then,
				};

				this.updateAcceptanceCriteria(acceptanceCriteriaUpdateRequest, criteria.criteriaEid).subscribe({
					next: (response) => console.log("Critério de aceitação editado com sucesso:", response),
					error: (error) => console.error("Erro ao editar o critério de aceitação:", error),
				});
			}
		});
	}

	private createNewCriteria(newCriteria: AcceptanceCriteriaNewRequest[], userstoryEid: string) {
		newCriteria.forEach((criteria) => {
			this.createAcceptanceCriteria(criteria).subscribe({
				next: (response) => console.log("Critério de aceitação criado com sucesso:", response),
				error: (error) => console.error("Erro ao criar o critério de aceitação:", error),
			});
		});
	}

	createUserStory(userstoryNewRequest: UserstoryNewRequest): Observable<UserstoryResponse> {
		return this.userstoryApiService.newUserstory(userstoryNewRequest, this.projectEid);
	}

	createAcceptanceCriteria(acceptanceCriteriaNewRequest: AcceptanceCriteriaNewRequest) {
		return this.userstoryApiService.newAcceptanceCriteria(acceptanceCriteriaNewRequest, this.projectEid);
	}

	updateUserStory(userstoryUpdateRequest: UserstoryUpdateRequest): Observable<UserstoryResponse> {
		return this.userstoryApiService.updateUserstories(this.projectEid, this.userStoryEid, userstoryUpdateRequest);
	}

	updateAcceptanceCriteria(acceptanceCriteriaUpdateRequest: AcceptanceCriteriaUpdateRequest, criteriaEid: string) {
		return this.userstoryApiService.updateAcceptanceCriteria(this.projectEid, criteriaEid, acceptanceCriteriaUpdateRequest);
	}
}
