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

	@ViewChild("inputRef", { static: true }) inputElement!: ElementRef;

	ngOnInit(): void {}

	ngOnDestroy(): void {}

	get value(): string {
		return this.inputElement.nativeElement.value;
	}
}
