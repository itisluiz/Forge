import { Pipe, PipeTransform } from "@angular/core";
import { TaskType } from "forge-shared/enum/tasktype.enum";

@Pipe({
	name: "taskTypeClass",
	standalone: true,
})
export class TaskTypeClassPipe implements PipeTransform {
	transform(value: TaskType): string {
		switch (value) {
			case TaskType.TASK:
				return "task";
			case TaskType.BUG:
				return "bug";
			case TaskType.TEST:
				return "test";
			default:
				return "";
		}
	}
}
