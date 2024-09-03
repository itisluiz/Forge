import { Pipe, PipeTransform } from "@angular/core";
import { SprintStatus } from "forge-shared/enum/sprintstatus.enum";

@Pipe({
	name: "sprintStatus",
	standalone: true,
})
export class SprintStatusPipe implements PipeTransform {
	transform(value: SprintStatus): string {
		switch (value) {
			case SprintStatus.PLAN:
				return "Plan";
			case SprintStatus.DESIGN:
				return "Design";
			case SprintStatus.DEVELOP:
				return "Develop";
			case SprintStatus.TEST:
				return "Test";
			case SprintStatus.DEPLOY:
				return "Deploy";
			case SprintStatus.LAUNCH:
				return "Complete";
			case SprintStatus.REVIEW:
				return "Review";
			default:
				return "Unknown status";
		}
	}
}
