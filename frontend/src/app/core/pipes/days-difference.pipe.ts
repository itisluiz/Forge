import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "daysDifference",
	standalone: true,
})
export class DaysDifferencePipe implements PipeTransform {
	transform(endsAt: string): number {
		const endsAtDate = new Date(endsAt);
		const now = new Date();

		const diffTime = endsAtDate.getTime() - now.getTime();
		if (diffTime < 0) {
			return 0;
		}

		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}
}
