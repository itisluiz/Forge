import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "pokerScore",
	standalone: true,
})
export class PokerScorePipe implements PipeTransform {
	transform(pokerVote: number | null | undefined): string {
		switch (pokerVote) {
			case null:
				return "?";
			case undefined:
				return "No vote";
		}

		return pokerVote.toString();
	}
}
