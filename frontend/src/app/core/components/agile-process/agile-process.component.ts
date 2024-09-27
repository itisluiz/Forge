import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { SprintStatus } from "forge-shared/enum/sprintstatus.enum";

@Component({
	selector: "app-agile-process",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./agile-process.component.html",
	styleUrl: "./agile-process.component.scss",
})
export class AgileProcessComponent implements OnInit {
	@Input() sprintStatus!: SprintStatus;
	active: boolean = true;

	ngOnInit(): void {
		this.applyFilter();
	}

	ngOnChanges(changes: SimpleChanges): void {
		// When the sprint status changes in the sprint details page, apply the filter again
		if (changes["sprintStatus"] && !changes["sprintStatus"].isFirstChange()) {
			this.applyFilter();
		}
	}

	private applyFilter(): void {
		const statusMap: Record<SprintStatus, string> = {
			[SprintStatus.PLAN]: "plan",
			[SprintStatus.DESIGN]: "design",
			[SprintStatus.DEVELOP]: "develop",
			[SprintStatus.TEST]: "test",
			[SprintStatus.DEPLOY]: "deploy",
			[SprintStatus.REVIEW]: "review",
			[SprintStatus.LAUNCH]: "launch",
		};

		const status = this.sprintStatus ? statusMap[this.sprintStatus] : null;
		if (status) {
			this.setFilter(status);
		}
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
