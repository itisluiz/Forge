import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-input",
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
	templateUrl: "./input-component.html",
	styleUrl: "./input-component.scss",
})
export class InputComponent implements OnInit, OnDestroy {
	@Input() label!: string;
	@Input() for!: string;
	@Input() name!: string;
	@Input() type!: string;
	@Input() placeholder?: string;
	@Input() errorMessage?: string;
	@Input() innerHTML?: string;
	@Input() upperCase: boolean = false;
	@Input() required: boolean = false;
	@Input() minLength: number = 0;
	@Input() maxLength: number = 1024;
	@Input() input?: any;
	@Input() hidden: boolean = false;
	@Input() disabled: boolean = false;
	@Input() defaultValue: string = "";

	@ViewChild("inputRef", { static: true }) inputElement!: ElementRef;

	ngOnInit(): void {
		this.checkInnerHTML();
	}

	ngOnDestroy(): void {}

	checkInnerHTML(): void {
		if (this.innerHTML) {
			this.setValue();
		}
	}

	setValue(): void {
		this.inputElement.nativeElement.value = this.innerHTML;
	}

	get value(): string {
		return this.inputElement.nativeElement.value;
	}

	get valid(): boolean {
		if (this.value.length < this.minLength || this.value.length > this.maxLength) {
			return false;
		}

		if (this.required && this.value.length === 0) {
			return false;
		}

		return this.inputElement.nativeElement.validity.valid;
	}
}
