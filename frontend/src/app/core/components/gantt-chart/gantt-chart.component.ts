import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { SprintApiService } from "../../services/sprint-api.service";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { GanttResponse } from "forge-shared/dto/response/ganttresponse.dto";

@Component({
	selector: "app-gantt-chart",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./gantt-chart.component.html",
	styleUrl: "./gantt-chart.component.scss",
})
export class GanttChartComponent implements OnInit {
	@Input() projectEid: string = "";
	@Input() sprintEid: string = "";

	@ViewChild("ganttChart")
	ganttChart!: ElementRef;

	chart: any;

	constructor(private sprintApiService: SprintApiService) {}

	ngOnInit(): void {
		this.loadData();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["sprintEid"]) {
			this.sprintEid = changes["sprintEid"].currentValue;
			this.loadData();
		}
	}

	loadData() {
		this.sprintApiService.getGanttData(this.projectEid, this.sprintEid).subscribe({
			next: (ganttResponse) => {
				console.log("Gantt Response");
				console.log(ganttResponse);
				this.processGanttData(ganttResponse);
			},
		});
	}

	processGanttData(ganttResponse: GanttResponse) {
		const taskLabels = this.getTaskLabels(ganttResponse.tasks);
		const taskTimelines = this.getTaskTimelines(ganttResponse.tasks);

		if (this.chart) {
			this.chart.destroy();
		}

		this.chart = new Chart(this.ganttChart.nativeElement, {
			type: "bar",
			data: {
				labels: taskLabels,
				datasets: [
					{
						label: "Task Timeline",
						data: taskTimelines,
						backgroundColor: "rgb(81, 206, 60)",
						borderColor: "rgb(81, 206, 60)",
						barThickness: 15,
					},
				],
			},
			options: {
				indexAxis: "y",
				scales: {
					x: {
						position: "top",
						min: ganttResponse.startsAt.split("T")[0],
						max: ganttResponse.endsAt.split("T")[0],
						type: "time",
						time: {
							unit: "day",
						},
					},
					y: {
						beginAtZero: true,
					},
				},
				plugins: {
					tooltip: {
						callbacks: {
							label: function (this, tooltipItem) {
								const task = this.chart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex] as
									| [string, string]
									| null;
								if (task) {
									return `Início: ${task[0]}, Fim: ${task[1]}`;
								}
								return "";
							},
						},
					},
				},
			},
		});
	}

	getTaskLabels(tasks: any[]): string[] {
		// Sort tasks order in Y axis by startedAt date
		return tasks
			.sort((a, b) => {
				const dateA = a.startedAt ? new Date(a.startedAt).getTime() : Infinity;
				const dateB = b.startedAt ? new Date(b.startedAt).getTime() : Infinity;
				return dateA - dateB;
			})
			.map((task) => task.taskCode);
	}

	getTaskTimelines(tasks: any[]): string | null[][] {
		// Sort tasks timelines in axis X by startedAt date
		return tasks
			.sort((a, b) => {
				const dateA = a.startedAt ? new Date(a.startedAt).getTime() : Infinity;
				const dateB = b.startedAt ? new Date(b.startedAt).getTime() : Infinity;
				return dateA - dateB;
			})
			.map((task) => [
				task.startedAt ? task.startedAt.split("T")[0] : null,
				task.completedAt ? task.completedAt.split("T")[0] : null,
			])
			.filter((task) => task[0] && task[1]);
	}
}
