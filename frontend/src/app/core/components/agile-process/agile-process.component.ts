import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-agile-process",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./agile-process.component.html",
	styleUrl: "./agile-process.component.scss",
})
export class AgileProcessComponent implements OnInit {
	status: string = "";
	active: boolean = true;

	ngOnInit(): void {
		this.status = "launch";
		this.setFilter(this.status);
	}

	setFilter(status: string): boolean {
		const validStatuses = ["plan", "design", "develop", "test", "deploy", "review", "launch"];
		if (validStatuses.includes(status)) {
			for (const validStatus of validStatuses) {
				const element = document.getElementById(validStatus);
				if (element) {
					if (status == validStatus) {
						element.style.filter = "none";
						continue;
					}
					element.style.filter = "grayscale(1)";
				}
			}
			return true;
		}
		return false;
	}
}
