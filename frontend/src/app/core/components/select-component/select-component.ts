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
	selector: "app-select",
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
	templateUrl: "./select-component.html",
	styleUrl: "./select-component.scss",
})
export class SelectComponent implements OnInit, OnDestroy {
	@Input() label!: string;
	@Input() for!: string;
	@Input() name!: string;
	@Input() errorMessage?: string;
	@Input() innerHTML?: string;
	@Input() options!: any[];

	@ViewChild("selectRef", { static: true }) selectElement!: ElementRef;

	selectedOption: any | null = null;

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
		this.selectElement.nativeElement.value = this.innerHTML;
	}

	get value(): string {
		let value: any;
		if (typeof this.selectedOption === "string") {
			value = this.selectedOption.toString();
			return value;
		}
		if (typeof this.selectedOption === "boolean") {
			value = Boolean(this.selectedOption);
			return value;
		}
		return this.selectedOption || "";
	}
}
