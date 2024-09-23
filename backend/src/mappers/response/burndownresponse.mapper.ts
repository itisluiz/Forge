import { BurndownResponse } from "forge-shared/dto/response/burndownresponse.dto";
import { mapBurndownEntriesComposite } from "../composite/burndownentriescomposite.mapper.js";

export function mapBurndownResponse(sprint: any): BurndownResponse {
	const burndownEntries = mapBurndownEntriesComposite(sprint);

	return {
		startsAt: sprint.dataValues.startsAt,
		endsAt: sprint.dataValues.endsAt,
		maxEffort: burndownEntries.length > 0 ? Math.max(...burndownEntries.map((entry) => entry.effort)) : 0,
		remaningEffort: burndownEntries.length > 0 ? burndownEntries[burndownEntries.length - 1].effort : 0,
		days: burndownEntries,
	};
}
