import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "maxLength",
	standalone: true,
})
export class MaxLengthPipe implements PipeTransform {
	transform(text: string, maxLength: number = 100): string {
		if (text.length > maxLength) {
			text = text.slice(0, maxLength);
			text += "...";
		}
		return text;
	}
}
