import { Component } from "@angular/core";
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

@Component({
	selector: "app-main-page",
	standalone: true,
	imports: [AgileProcessComponent, NavbarComponent, MatIconModule, RouterModule],
	templateUrl: "./main-page.component.html",
	styleUrl: "./main-page.component.scss",
})
export class MainPageComponent {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;
	currentAndFutureSprints: SprintSelfComposite[] = [];
	currentSprint: SprintSelfComposite = {} as SprintSelfComposite;
	pastSprints: SprintSelfComposite[] = [];
	selectedSprint: SprintSelfComposite = {} as SprintSelfComposite;
	detailedSprint: SprintResponse = {} as SprintResponse;
	tasksFromSelectedSprint: TaskSelfComposite[] = [];
	leadTimeDaysAverage: number = 0;
	sprintVelocity: number = 0;

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
				this.currentAndFutureSprints = sprintSelfResponse.sprints.filter(
					(sprint) =>
						sprint.periodStatus === SprintPeriodStatus.ONGOING || sprint.periodStatus === SprintPeriodStatus.FUTURE,
				);
				this.currentSprint =
					this.currentAndFutureSprints.find((sprint) => sprint.periodStatus === SprintPeriodStatus.ONGOING) ||
					({} as SprintSelfComposite);
				this.selectedSprint = this.currentSprint;
				this.pastSprints = sprintSelfResponse.sprints.filter((sprint) => sprint.periodStatus === SprintPeriodStatus.PAST);
				this.loadLeadTimeMetrics();
			},
		});
	}

	setSprint(event: any) {
		const selectedValue = event.target.value;
		this.selectedSprint = this.currentAndFutureSprints.find((sprint) => sprint.eid == selectedValue)!;
	}

	loadLeadTimeMetrics() {
		this.sprintApiService.getSprint(this.projectEid, this.currentSprint.eid).subscribe({
			next: (sprintResponse) => {
				this.detailedSprint = sprintResponse;
				this.tasksFromSelectedSprint = sprintResponse.tasks;
				this.calculateLeadTimeAverage(this.tasksFromSelectedSprint);
			},
		});
	}

	calculateLeadTimeAverage(tasks: TaskSelfComposite[]) {
		const leadTimes = tasks.map((task) => {
			const createdAt = task.createdAt ? new Date(task.createdAt).getTime() : 0;
			const completedAt = task.completedAt ? new Date(task.completedAt).getTime() : 0;
			return completedAt - createdAt;
		});

		const validLeadTimes = leadTimes.filter((leadTime) => leadTime > 0);

		if (validLeadTimes.length === 0) {
			this.leadTimeDaysAverage = 0;
			return;
		}

		const totalLeadTime = validLeadTimes.reduce((acc, leadTime) => acc + leadTime, 0);
		const leadTimeAverage = totalLeadTime / validLeadTimes.length;

		this.leadTimeDaysAverage = leadTimeAverage / (1000 * 60 * 60 * 24);
		console.log(this.leadTimeDaysAverage);
	}

	calculateSprintVelocity(tasks: TaskSelfComposite[]) {
		const completedTasks = tasks.filter((task) => task.status === TaskStatus.DONE);
		const totalComplexity = completedTasks.reduce((acc, task) => acc + task.complexity!, 0);
		this.sprintVelocity = totalComplexity / this.leadTimeDaysAverage;
	}
}
