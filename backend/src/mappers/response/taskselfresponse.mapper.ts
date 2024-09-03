import { mapTaskSelfComposite } from "../composite/taskselfcomposite.mapper.js";
import { TaskSelfResponse } from "forge-shared/dto/response/taskselfresponse.dto";

export function mapTaskSelfResponse(tasks: any, projectCode: string): TaskSelfResponse {
	return {
		tasks: tasks.map((task: any) => mapTaskSelfComposite(task, projectCode)),
	};
}
