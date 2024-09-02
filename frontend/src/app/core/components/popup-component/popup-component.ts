import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-popup-component",
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
	templateUrl: "./popup-component.html",
	styleUrl: "./popup-component.scss",
})
export class PopupComponent implements OnInit, OnDestroy {
	@Input() title!: string;
	@Input() description!: string;
	@Input() buttonName!: string;
	@Input() buttonCancelName!: string;
	@Input() cancelButton!: boolean;
	@Input() buttonEnabled: boolean = true;
	@Input() loading: boolean = false;
	@Output() closePopUpEmitter = new EventEmitter<void>();
	@Output() onButtonClick = new EventEmitter<void>();

	popUpActive!: boolean;

	ngOnInit(): void {
		this.popUpActive = true;
	}

	ngOnDestroy(): void {}

	buttonClicked() {
		this.onButtonClick.emit();
	}

	closePopUp() {
		this.closePopUpEmitter.emit();
	}
}
