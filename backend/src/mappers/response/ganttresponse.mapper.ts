import { GanttResponse } from "forge-shared/dto/response/ganttresponse.dto.js";
import { mapGanttEntryComposite } from "../composite/ganttentrycomposite.mapper.js";

export function mapGanttResponse(sprint: any, projectCode: string): GanttResponse {
	const tasks = sprint.dataValues.userstories.flatMap((userstory: any) => userstory.dataValues.tasks);

	return {
		startsAt: sprint.dataValues.startsAt,
		endsAt: sprint.dataValues.endsAt,
		totalTasks: tasks.length,
		remainingTasks: tasks.filter((task: any) => !task.dataValues.completedAt).length,
		tasks: tasks.map((task: any) => mapGanttEntryComposite(task, projectCode)),
	};
}
