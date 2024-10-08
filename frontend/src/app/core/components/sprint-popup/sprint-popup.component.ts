import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";
import { SprintNewRequest } from "forge-shared/dto/request/sprintnewrequest.dto";
import { SprintStatus } from "forge-shared/enum/sprintstatus.enum";
import { SprintApiService } from "../../services/sprint-api.service";
import { SprintUpdateRequest } from "forge-shared/dto/request/sprintupdaterequest.dto";

@Component({
	selector: "app-sprint-popup",
	standalone: true,
	imports: [
		CommonModule,
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
	templateUrl: "./sprint-popup.component.html",
	styleUrl: "./sprint-popup.component.scss",
})
export class SprintPopupComponent implements OnInit, OnDestroy {
	@Input() isEditMode: boolean = false;
	@Input() projectEid: string = "";
	@Input() sprintEid: string = "";
	@Output() closePopUpEmitter = new EventEmitter<void>();
	@Output() handleSprintAndClosePopupEmitter: EventEmitter<void> = new EventEmitter();
	@Output() handleEditedSprintAndClosePopupEmitter: EventEmitter<void> = new EventEmitter();
	popUpActive: boolean = false;
	sprintForm!: FormGroup;
	creationFailed: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private sprintApiService: SprintApiService,
	) {}

	ngOnInit(): void {
		this.sprintForm = this.formBuilder.group({
			startDate: [this.getDateAfterDays(0), Validators.required],
			endDate: [this.getDateAfterDays(15), Validators.required],
		});
		if (this.isEditMode) {
			this.sprintForm.addControl("status", this.formBuilder.control("", Validators.required));
			this.sprintApiService.getSprint(this.projectEid, this.sprintEid).subscribe((sprintResponse) => {
				this.sprintForm.patchValue({
					startDate: sprintResponse.startsAt.split("T")[0],
					endDate: sprintResponse.endsAt.split("T")[0],
					status: sprintResponse.status,
				});
			});
		}
	}

	private getDateAfterDays(days: number): string {
		const date = new Date();
		date.setDate(date.getDate() + days);
		return date.toLocaleDateString("en-CA");
	}

	ngOnDestroy(): void {}

	closePopUp() {
		this.sprintForm.reset();
		this.closePopUpEmitter.emit();
	}

	submitSprintForm() {
		if (this.sprintForm.valid) {
			if (!this.isEditMode) {
				const sprintNewRequest = this.buildSprintNewRequest();
				this.createSprint(sprintNewRequest);
			} else {
				const sprintUpdateRequest = this.buildSprintUpdateRequest();
				this.updateSprint(sprintUpdateRequest);
			}
		}
	}

	private buildSprintNewRequest(): SprintNewRequest {
		return {
			startsAt: this.convertLocalToUTCISO(this.sprintForm.get("startDate")?.value),
			endsAt: this.convertLocalToUTCISO(this.sprintForm.get("endDate")?.value),
			status: SprintStatus.PLAN,
		} as SprintNewRequest;
	}

	private buildSprintUpdateRequest(): SprintUpdateRequest {
		return {
			startsAt: this.convertLocalToUTCISO(this.sprintForm.get("startDate")?.value),
			endsAt: this.convertLocalToUTCISO(this.sprintForm.get("endDate")?.value),
			status: parseInt(this.sprintForm.get("status")?.value),
		} as SprintUpdateRequest;
	}

	private convertLocalToUTCISO(date: string): string {
		const localDate = new Date(date);
		const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
		return utcDate.toISOString();
	}

	private createSprint(sprintNewRequest: SprintNewRequest) {
		this.sprintApiService.newSprint(sprintNewRequest, this.projectEid).subscribe(() => {
			this.handleSprintAndClosePopupEmitter.emit();
		});
	}

	private updateSprint(sprintUpdateRequest: SprintUpdateRequest) {
		this.sprintApiService.updateSprint(sprintUpdateRequest, this.projectEid, this.sprintEid).subscribe(() => {
			this.handleEditedSprintAndClosePopupEmitter.emit();
		});
	}
}
