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
	selector: "app-delete-popup",
	standalone: true,
	imports: [CommonModule, MatInputModule, MatButtonModule],
	templateUrl: "./delete-popup.component.html",
	styleUrl: "./delete-popup.component.scss",
})
export class DeletePopupComponent {
	@Input() itemEid: string = "";
	@Input() title: string = "";
	@Input() description: string = "";
	@Output() confirmDeleteEmmiter = new EventEmitter<string>();
	@Output() cancelEmitter = new EventEmitter<void>();

	confirmDelete() {
		this.confirmDeleteEmmiter.emit(this.itemEid);
	}

	cancel() {
		this.cancelEmitter.emit();
	}
}
