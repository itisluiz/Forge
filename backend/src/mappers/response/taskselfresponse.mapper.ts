import { mapTaskSelfComposite } from "../composite/taskselfcomposite.mapper.js";
import { TaskSelfResponse } from "forge-shared/dto/response/taskselfresponse.dto";

export function mapTaskSelfResponse(tasks: any): TaskSelfResponse {
	return {
		tasks: tasks.map(mapTaskSelfComposite),
	};
}
