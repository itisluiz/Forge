import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "icon",
	standalone: true,
})
export class IconPipe implements PipeTransform {
	transform(value: string): string {
		return `../../../../../assets/${value}.svg`;
	}
}
