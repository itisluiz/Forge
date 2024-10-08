import { Pipe, PipeTransform } from "@angular/core";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum";

@Pipe({
	name: "taskStatus",
	standalone: true,
})
export class TaskStatusPipe implements PipeTransform {
	transform(value?: TaskStatus): string {
		switch (value) {
			case TaskStatus.TODO:
				return "To do";
			case TaskStatus.INPROGRESS:
				return "In Progress";
			case TaskStatus.AVAILABLETOREVIEW:
				return "Available to Review";
			case TaskStatus.REVIEWING:
				return "Reviewing";
			case TaskStatus.DONE:
				return "Done";
			default:
				return "";
		}
	}
}
