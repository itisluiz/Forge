import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AgileProcessComponent } from "../../agile-process/agile-process.component";
import { NavbarComponent } from "../../navbar/navbar.component";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { SprintSelfComposite } from "forge-shared/dto/composite/sprintselfcomposite.dto";
import { SprintApiService } from "../../../services/sprint-api.service";
import { SprintPeriodStatus } from "forge-shared/enum/sprintperiodstatus.enum";
import { MatIconModule } from "@angular/material/icon";
import { SprintResponse } from "forge-shared/dto/response/sprintresponse.dto";
import { TaskSelfComposite } from "forge-shared/dto/composite/taskselfcomposite.dto";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum";
import { BurndownChartComponent } from "../../burndown-chart/burndown-chart.component";
import { CommonModule } from "@angular/common";
import { GanttChartComponent } from "../../gantt-chart/gantt-chart.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { TaskType } from "forge-shared/enum/tasktype.enum";
import { SprintOverviewResponse } from "forge-shared/dto/response/sprintoverviewresponse.dto";
import { finalize } from "rxjs";

@Component({
	selector: "app-main-page",
	standalone: true,
	imports: [
		AgileProcessComponent,
		NavbarComponent,
		MatIconModule,
		RouterModule,
		BurndownChartComponent,
		CommonModule,
		GanttChartComponent,
		MatTooltipModule,
		MatProgressBarModule,
	],
	templateUrl: "./main-page.component.html",
	styleUrl: "./main-page.component.scss",
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainPageComponent {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;
	allSprints: SprintSelfComposite[] = [];
	currentSprint: SprintSelfComposite = {} as SprintSelfComposite;
	pastAndCurrentSprints: SprintSelfComposite[] = [];
	pastSprints: SprintSelfComposite[] = [];
	selectedSprint: SprintSelfComposite = {} as SprintSelfComposite;
	tasksFromSelectedSprint: TaskSelfComposite[] = [];

	currentSprintOverview?: SprintOverviewResponse;
	loadingSprintOverview = false;

	bugTaskTotal: number = 0;
	bugTaskDoneTotal: number = 0;
	bugTaskDonePercentage: number = 0;
	testTaskTotal: number = 0;
	testTaskDoneTotal: number = 0;
	testTaskDonePercentage: number = 0;
	featureTotal: number = 0;
	featureDoneTotal: number = 0;
	featureDonePercentage: number = 0;

	sprintLeadTime: string = "-";
	averageSprintsLeadTime: string = "-";
	sprintVelocity: string = "-";
	averageSprintsVelocity: string = "-";

	leadTimeMetricImageUrl: string = "";
	velocityMetricImageUrl: string = "";

	navigationOptions = {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	};

	constructor(
		private route: ActivatedRoute,
		private sprintApiService: SprintApiService,
	) {}

	ngOnInit() {
		this.loadSprintData();
	}

	loadSprintData() {
		this.sprintApiService.self(this.projectEid).subscribe({
			next: (sprintSelfResponse) => {
				this.allSprints = sprintSelfResponse.sprints;
				this.pastAndCurrentSprints = sprintSelfResponse.sprints.filter(
					(sprint) => sprint.periodStatus === SprintPeriodStatus.PAST || sprint.periodStatus === SprintPeriodStatus.ONGOING,
				);

				const curSprint = this.pastAndCurrentSprints.find((sprint) => sprint.periodStatus === SprintPeriodStatus.ONGOING);
				if (!curSprint) {
					return;
				}

				this.currentSprint = curSprint;

				this.selectedSprint = this.currentSprint;
				this.pastSprints = sprintSelfResponse.sprints.filter((sprint) => sprint.periodStatus === SprintPeriodStatus.PAST);
				this.loadMetrics();
				this.loadSprintOverview();
			},
		});
	}

	setSprint(event: any) {
		const selectedValue = event.target.value;
		this.selectedSprint = this.allSprints.find((sprint) => sprint.eid == selectedValue)!;
		this.loadMetrics();
	}

	loadMetrics() {
		this.sprintApiService.getSprint(this.projectEid, this.selectedSprint.eid).subscribe({
			next: (sprintResponse) => {
				// Lead time and velocity
				this.tasksFromSelectedSprint = sprintResponse.tasks;
				this.calculateLeadTime(this.tasksFromSelectedSprint);
				this.calculateSprintVelocity(this.tasksFromSelectedSprint);
				this.calculateAverageSprintsLeadTime();
				this.calculateAverageSprintsVelocity();

				// Task type metrics
				this.bugTaskTotal = this.tasksFromSelectedSprint.filter((task) => task.type === TaskType.BUG).length;
				this.bugTaskDoneTotal = this.tasksFromSelectedSprint.filter(
					(task) => task.type === TaskType.BUG && task.status === TaskStatus.DONE,
				).length;
				this.bugTaskDonePercentage = this.bugTaskTotal === 0 ? 0 : (this.bugTaskDoneTotal / this.bugTaskTotal) * 100;

				this.testTaskTotal = this.tasksFromSelectedSprint.filter((task) => task.type === TaskType.TEST).length;
				this.testTaskDoneTotal = this.tasksFromSelectedSprint.filter(
					(task) => task.type === TaskType.TEST && task.status === TaskStatus.DONE,
				).length;
				this.testTaskDonePercentage = this.testTaskTotal === 0 ? 0 : (this.testTaskDoneTotal / this.testTaskTotal) * 100;

				this.featureTotal = this.tasksFromSelectedSprint.filter((task) => task.type === TaskType.TASK).length;
				this.featureDoneTotal = this.tasksFromSelectedSprint.filter(
					(task) => task.type === TaskType.TASK && task.status === TaskStatus.DONE,
				).length;
				this.featureDonePercentage = (this.featureDoneTotal / this.featureTotal) * 100;
			},
		});
	}

	loadSprintOverview(forceRegenerate = false) {
		if (!this.selectedSprint?.eid || this.loadingSprintOverview) {
			return;
		}

		this.loadingSprintOverview = true;
		this.sprintApiService
			.overview(this.projectEid, this.selectedSprint.eid, forceRegenerate)
			.pipe(finalize(() => (this.loadingSprintOverview = false)))
			.subscribe({
				next: (sprintOverviewResponse) => {
					this.currentSprintOverview = sprintOverviewResponse;
				},
			});
	}

	calculateLeadTime(tasks: TaskSelfComposite[]) {
		if (this.selectedSprint.eid === this.currentSprint.eid) {
			this.sprintLeadTime = "-";
			return;
		}
		const leadTimes = tasks.map((task) => {
			const createdAt = task.createdAt ? new Date(task.createdAt).getTime() : 0;
			const completedAt = task.completedAt ? new Date(task.completedAt).getTime() : 0;
			return completedAt - createdAt;
		});

		const validLeadTimes = leadTimes.filter((leadTime) => leadTime > 0);

		if (validLeadTimes.length === 0) {
			this.sprintLeadTime = "-";
			return;
		}

		const totalLeadTime = validLeadTimes.reduce((acc, leadTime) => acc + leadTime, 0);
		const leadTimeAverage = totalLeadTime / validLeadTimes.length;

		const leadTimeDays = leadTimeAverage / (1000 * 60 * 60 * 24);

		this.sprintLeadTime = Number.isInteger(leadTimeDays)
			? leadTimeDays.toString()
			: (Math.floor(leadTimeDays * 10) / 10).toFixed(1);
	}

	calculateAverageSprintsLeadTime() {
		let totalLeadTime = 0;
		let sprintCount = this.pastSprints.length;

		if (sprintCount === 0) {
			this.averageSprintsLeadTime = "-";
			return;
		}

		let completedRequests = 0;

		this.pastSprints.forEach((sprint) => {
			this.sprintApiService.getSprint(this.projectEid, sprint.eid).subscribe((sprintResponse) => {
				const leadTimes = sprintResponse.tasks.map((task) => {
					const createdAt = task.createdAt ? new Date(task.createdAt).getTime() : 0;
					const completedAt = task.completedAt ? new Date(task.completedAt).getTime() : 0;
					return completedAt - createdAt;
				});

				const validLeadTimes = leadTimes.filter((leadTime) => leadTime > 0);

				if (validLeadTimes.length > 0) {
					const totalSprintLeadTime = validLeadTimes.reduce((acc, leadTime) => acc + leadTime, 0);
					const sprintLeadTimeAverage = totalSprintLeadTime / validLeadTimes.length;
					totalLeadTime += sprintLeadTimeAverage;
				}

				completedRequests++;

				if (completedRequests === sprintCount) {
					const averageLeadTime = totalLeadTime / sprintCount;
					const leadTimeDays = averageLeadTime / (1000 * 60 * 60 * 24);
					this.averageSprintsLeadTime = Number.isInteger(leadTimeDays)
						? leadTimeDays.toString()
						: (Math.floor(leadTimeDays * 10) / 10).toFixed(1);
					this.setLeadTimeMetricImageUrl();
				}
			});
		});
	}

	setLeadTimeMetricImageUrl() {
		if (this.sprintLeadTime === "-") {
			this.leadTimeMetricImageUrl = "";
		} else {
			if (parseFloat(this.sprintLeadTime) < parseFloat(this.averageSprintsLeadTime)) {
				this.leadTimeMetricImageUrl = "../../../../../assets/metrics/metric-down-green.svg";
			} else if (parseFloat(this.sprintLeadTime) > parseFloat(this.averageSprintsLeadTime)) {
				this.leadTimeMetricImageUrl = "../../../../../assets/metrics/metric-up-red.svg";
			} else {
				this.leadTimeMetricImageUrl = "../../../../../assets/unassigned-user.svg";
			}
		}
	}

	calculateSprintVelocity(tasks: TaskSelfComposite[]) {
		if (this.selectedSprint.eid === this.currentSprint.eid) {
			this.sprintVelocity = "-";
			return;
		}
		const completedTasks = tasks.filter((task) => task.status === TaskStatus.DONE);
		this.sprintVelocity = completedTasks.reduce((total, task) => total + (task.complexity ?? 0), 0).toString();
	}

	calculateAverageSprintsVelocity() {
		let totalVelocity = 0;
		let sprintCount = this.pastSprints.length;

		if (sprintCount === 0) {
			this.averageSprintsVelocity = "-";
			return;
		}

		let completedRequests = 0;

		this.pastSprints.forEach((sprint) => {
			this.sprintApiService.getSprint(this.projectEid, sprint.eid).subscribe((sprintResponse) => {
				const completedTasks = sprintResponse.tasks.filter((task) => task.status === TaskStatus.DONE);
				const sprintVelocity = completedTasks.reduce((total, task) => total + (task.complexity ?? 0), 0);
				totalVelocity += sprintVelocity;
				completedRequests++;

				if (completedRequests === sprintCount) {
					const averageVelocity = totalVelocity / sprintCount;
					this.averageSprintsVelocity = Number.isInteger(averageVelocity)
						? averageVelocity.toString()
						: (Math.floor(averageVelocity * 10) / 10).toFixed(1);
					this.setVelocityMetricImageUrl();
				}
			});
		});
	}

	setVelocityMetricImageUrl() {
		if (this.sprintVelocity === "-") {
			this.velocityMetricImageUrl = "";
		} else {
			if (parseFloat(this.sprintVelocity) > parseFloat(this.averageSprintsVelocity)) {
				this.velocityMetricImageUrl = "../../../../../assets/metrics/metric-up-green.svg";
			} else if (parseFloat(this.sprintVelocity) < parseFloat(this.averageSprintsVelocity)) {
				this.velocityMetricImageUrl = "../../../../../assets/metrics/metric-down-red.svg";
			} else {
				this.velocityMetricImageUrl = "../../../../../assets/unassigned-user.svg";
			}
		}
	}
}
