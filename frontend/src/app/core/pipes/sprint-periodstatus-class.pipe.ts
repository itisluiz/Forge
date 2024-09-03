import { Pipe, PipeTransform } from "@angular/core";
import { SprintPeriodStatus } from "forge-shared/enum/sprintperiodstatus.enum";

@Pipe({
	name: "sprintPeriodStatusClass",
	standalone: true,
})
export class SprintPeriodStatusClassPipe implements PipeTransform {
	transform(value: SprintPeriodStatus): string {
		switch (value) {
			case SprintPeriodStatus.PAST:
				return "past";
			case SprintPeriodStatus.ONGOING:
				return "ongoing";
			case SprintPeriodStatus.FUTURE:
				return "future";
			default:
				return "";
		}
	}
}
