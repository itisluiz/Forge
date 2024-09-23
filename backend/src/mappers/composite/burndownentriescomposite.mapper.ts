import { BurndownEntryComposite } from "forge-shared/dto/composite/burndownentrycomposite.dto";

export function mapBurndownEntriesComposite(sprint: any): BurndownEntryComposite[] {
	const now = new Date();
	const result: BurndownEntryComposite[] = [];

	for (
		let date = new Date(sprint.dataValues.startsAt);
		date <= sprint.dataValues.endsAt && date <= now;
		date.setDate(date.getDate() + 1)
	) {
		const entry: BurndownEntryComposite = {
			date: date.toISOString(),
			effort: sprint.calculateBurndownForDate(date),
		};

		result.push(entry);
	}

	return result;
}
