import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "projectRole",
	standalone: true,
})
export class ProjectRolePipe implements PipeTransform {
	transform(value: number): string {
		switch (value) {
			case 1:
				return "Product Owner";
			case 2:
				return "Scrum Master";
			case 3:
				return "Developer";
			case 4:
				return "Tester";
			default:
				return "Unknown Role";
		}
	}
}
