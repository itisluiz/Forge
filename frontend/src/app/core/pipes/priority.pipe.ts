import { Pipe, PipeTransform } from "@angular/core";
import { Priority } from "forge-shared/enum/priority.enum";

@Pipe({
	name: "priority",
	standalone: true,
})
export class PriorityPipe implements PipeTransform {
	transform(value: Priority): string {
		switch (value) {
			case Priority.LOW:
				return "low";
			case Priority.MEDIUM:
				return "medium";
			case Priority.HIGH:
				return "high";
			default:
				return "";
		}
	}
}
