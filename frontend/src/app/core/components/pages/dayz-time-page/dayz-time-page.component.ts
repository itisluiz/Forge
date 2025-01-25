import { Component, OnDestroy } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Title } from "@angular/platform-browser";
import { DayZApiService } from "../../../services/dayz-api.service";
import { DayZTimeResponse } from "forge-shared/dto/response/dayztimeresponse.dto";

@Component({
	selector: "app-dayz-time-page",
	standalone: true,
	imports: [MatProgressSpinnerModule],
	templateUrl: "./dayz-time-page.component.html",
	styleUrl: "./dayz-time-page.component.scss",
})
export class DayZTimePageComponent implements OnDestroy {
	public dayZTimeResponse?: DayZTimeResponse;
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
				this.dayZTimeResponse = response;
				this.updateTabTitle();
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	// Update the browser tab's title
	private updateTabTitle() {
		this.titleService.setTitle(
			this.dayZTimeResponse
				? `DayZ ${this.dayZTimeResponse.time} (${this.dayZTimeResponse.players}/${this.dayZTimeResponse.maxPlayers})`
				: "Fetching dayZ...",
		);
	}

	// Start the interval for auto-refresh
	private startAutoRefresh() {
		this.intervalId = setInterval(() => this.updateTime(), 120_000); // 2 minutes
	}

	// Cleanup the interval when the component is destroyed
	ngOnDestroy() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}
}
