import { Pipe, PipeTransform } from "@angular/core";
import { SprintPeriodStatus } from "forge-shared/enum/sprintperiodstatus.enum";

@Pipe({
	name: "sprintPeriodStatus",
	standalone: true,
})
export class SprintPeriodStatusPipe implements PipeTransform {
	transform(value: SprintPeriodStatus): string {
		switch (value) {
			case SprintPeriodStatus.PAST:
				return "Past";
			case SprintPeriodStatus.ONGOING:
				return "On going";
			case SprintPeriodStatus.FUTURE:
				return "Future";
			default:
				return "Unknown period status";
		}
	}
}
