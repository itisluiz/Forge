import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-delete-popup",
	standalone: true,
	imports: [CommonModule, MatInputModule, MatButtonModule],
	templateUrl: "./delete-popup.component.html",
	styleUrl: "./delete-popup.component.scss",
})
export class DeletePopupComponent {
	@Input() title: string = "";
	@Input() description: string = "";
	@Input() confirmButtonLabel: string = "Delete";
	@Output() confirmDeleteEmmiter = new EventEmitter<string>();
	@Output() cancelEmitter = new EventEmitter<void>();

	confirmDelete() {
		this.confirmDeleteEmmiter.emit();
	}

	cancel() {
		this.cancelEmitter.emit();
	}
}
