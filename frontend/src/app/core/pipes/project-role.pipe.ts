import { Pipe, PipeTransform } from "@angular/core";
import { ProjectRole } from "forge-shared/enum/projectrole.enum";

@Pipe({
	name: "projectRole",
	standalone: true,
})
export class ProjectRolePipe implements PipeTransform {
	transform(value: ProjectRole): string {
		switch (value) {
			case ProjectRole.PRODUCT_OWNER:
				return "Product Owner";
			case ProjectRole.SCRUM_MASTER:
				return "Scrum Master";
			case ProjectRole.DEVELOPER:
				return "Developer";
			case ProjectRole.TESTER:
				return "Tester";
			default:
				return "Unknown Role";
		}
	}
}
