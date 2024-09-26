import { Pipe, PipeTransform } from "@angular/core";
import { ProjectRole } from "forge-shared/enum/projectrole.enum";

@Pipe({
	name: "role",
	standalone: true,
})
export class RolePipe implements PipeTransform {
	transform(value: ProjectRole | undefined): string {
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
				return "";
		}
	}
}
