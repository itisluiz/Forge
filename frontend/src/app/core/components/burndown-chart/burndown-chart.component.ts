import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { SprintApiService } from "../../services/sprint-api.service";
import { Chart } from "chart.js/auto";
import { forkJoin } from "rxjs";
import { BurndownResponse } from "forge-shared/dto/response/burndownresponse.dto";

@Component({
	selector: "app-burndown-chart",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./burndown-chart.component.html",
	styleUrl: "./burndown-chart.component.scss",
})
export class BurndownChartComponent implements OnInit {
	@Input() projectEid: string = "";
	@Input() sprintEid: string = "";

	@ViewChild("burndownChart")
	burndownChart!: ElementRef;

	constructor(private sprintApiService: SprintApiService) {}

	ngOnInit(): void {
		this.loadData();
	}

	loadData() {
		this.sprintApiService.getBurndownData(this.projectEid, this.sprintEid).subscribe({
			next: (burndownResponse) => {
				console.log(burndownResponse);
				this.processBurndownData(burndownResponse);
			},
		});
	}

	processBurndownData(burndownResponse: BurndownResponse) {
		const numberOfDays = this.getNumberOfDays(burndownResponse);
		const daysArray = Array.from({ length: numberOfDays }, (_, i) => `Day ${i + 1}`);
		const data = burndownResponse.days.map((day) => day.effort);
		const plannedData = this.getPlannedData(burndownResponse, numberOfDays);
		new Chart(this.burndownChart.nativeElement, {
			type: "line",
			data: {
				labels: daysArray,
				datasets: [
					{
						data: data,
						label: "Actual Task Completion",
						backgroundColor: "rgb(81, 206, 60)",
						borderColor: "rgb(81, 206, 60)",
						pointBackgroundColor: "rgb(81, 206, 60)",
						tension: 0.1,
					},
					{
						data: plannedData,
						label: "Planned Task Completion",
						backgroundColor: "rgb(142, 142, 142)",
						borderColor: "rgb(142, 142, 142)",
						pointBackgroundColor: "rgb(142, 142, 142)",
						tension: 0.1,
					},
				],
			},
			options: {
				plugins: {
					title: {
						display: false,
					},
				},
			},
		});
	}

	getNumberOfDays(burndownResponse: BurndownResponse): number {
		return Math.floor(
			(new Date(burndownResponse.endsAt).getTime() - new Date(burndownResponse.startsAt).getTime()) / (1000 * 60 * 60 * 24),
		);
	}

	getPlannedData(burndownResponse: BurndownResponse, numberOfDays: number): number[] {
		return Array.from({ length: numberOfDays }, (_, i) => {
			// Last value from the planned array has to be 0
			if (i === numberOfDays - 1) {
				return 0;
			} else {
				return Math.floor(burndownResponse.maxEffort - (burndownResponse.maxEffort / (numberOfDays - 1)) * i);
			}
		});
	}
}
