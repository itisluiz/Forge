import { BurndownEntryComposite } from "forge-shared/dto/composite/burndownentrycomposite.dto";

export function mapBurndownEntriesComposite(sprint: any): BurndownEntryComposite[] {
	const now = new Date();
	const result: BurndownEntryComposite[] = [];

	const firstDate = new Date(sprint.dataValues.startsAt);
	firstDate.setDate(firstDate.getDate() + 1);

	for (let date = firstDate; date <= sprint.dataValues.endsAt && date <= now; date.setDate(date.getDate() + 1)) {
		const entry: BurndownEntryComposite = {
			date: date.toISOString(),
			effort: sprint.calculateBurndownForDate(date),
		};

		result.push(entry);
	}

	return result;
}
