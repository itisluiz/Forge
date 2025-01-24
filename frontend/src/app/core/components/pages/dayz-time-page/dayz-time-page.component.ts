import { Component, OnDestroy } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Title } from "@angular/platform-browser";
import { DayZApiService } from "../../../services/dayz-api.service";

@Component({
	selector: "app-dayz-time-page",
	standalone: true,
	imports: [MatProgressSpinnerModule],
	templateUrl: "./dayz-time-page.component.html",
	styleUrl: "./dayz-time-page.component.scss",
})
export class DayZTimePageComponent implements OnDestroy {
	public time?: string;
	private intervalId?: ReturnType<typeof setInterval>;

	public constructor(
		private dayZApiService: DayZApiService,
		private titleService: Title,
	) {
		this.updateTime();
		this.startAutoRefresh();
	}

	// Fetch the time once and update the title
	updateTime() {
		this.dayZApiService.getTime().subscribe({
			next: (response) => {
				this.time = response.time;
				this.updateTabTitle();
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	// Update the browser tab's title
	private updateTabTitle() {
		this.titleService.setTitle(this.time ? `Time: ${this.time}` : "Fetching time...");
	}

	// Start the interval for auto-refresh
	private startAutoRefresh() {
		this.intervalId = setInterval(() => this.updateTime(), 180_000); // 3 minutes
	}

	// Cleanup the interval when the component is destroyed
	ngOnDestroy() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}
}
