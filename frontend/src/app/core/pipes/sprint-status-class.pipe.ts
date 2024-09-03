import { Pipe, PipeTransform } from "@angular/core";
import { SprintStatus } from "forge-shared/enum/sprintstatus.enum";

@Pipe({
	name: "sprintStatusClass",
	standalone: true,
})
export class SprintStatusClassPipe implements PipeTransform {
	transform(value: SprintStatus): string {
		switch (value) {
			case SprintStatus.PLAN:
				return "plan";
			case SprintStatus.DESIGN:
				return "design";
			case SprintStatus.DEVELOP:
				return "develop";
			case SprintStatus.TEST:
				return "test";
			case SprintStatus.DEPLOY:
				return "deploy";
			case SprintStatus.LAUNCH:
				return "complete";
			case SprintStatus.REVIEW:
				return "review";
			default:
				return "";
		}
	}
}
