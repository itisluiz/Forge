import { CdkDropList, DragDropModule } from "@angular/cdk/drag-drop";
import { Component, Input, ViewChild } from "@angular/core";
import { IconPipe } from "../../pipes/icon.pipe";
import { MatIcon } from "@angular/material/icon";
import { PriorityPipe } from "../../pipes/priority.pipe";
import { ProjectMemberComposite } from "forge-shared/dto/composite/projectmembercomposite.dto";
import { SprintResponse } from "forge-shared/dto/response/sprintresponse.dto";
import { TaskSelfComposite } from "forge-shared/dto/composite/taskselfcomposite.dto";
import { TaskStatus } from "forge-shared/enum/taskstatus.enum";
import { TaskStatusPipe } from "../../pipes/task-status.pipe";
import { TaskTypeClassPipe } from "../../pipes/task-type-class.pipe";
import { UserstorySelfComposite } from "forge-shared/dto/composite/userstoryselfcomposite.dto";

@Component({
	selector: "app-kanban-column",
	standalone: true,
	imports: [TaskTypeClassPipe, PriorityPipe, IconPipe, DragDropModule, TaskStatusPipe, MatIcon],
	templateUrl: "./kanban-column.component.html",
	styleUrl: "./kanban-column.component.scss",
})
export class KanbanColumnComponent {
	@ViewChild("dropList") dropList!: CdkDropList<TaskSelfComposite>;

	@Input() status!: TaskStatus;
	@Input() sprint!: SprintResponse;
	@Input() userstory!: UserstorySelfComposite;
	@Input() members!: ProjectMemberComposite[];
	@Input() dropListIds!: string[];
	@Input() dropCallback!: (event: any) => void;
	@Input() taskClickCallback!: (taskEid: string) => void;

	taskEffortUnset(task: TaskSelfComposite): boolean {
		return task.complexity === null || task.complexity === undefined;
	}

	ngAfterViewInit() {
		this.dropListIds.push((this.dropList as any).nativeElement.id);
	}

	getStatusTasks(): TaskSelfComposite[] {
		return this.sprint.tasks.filter((task) => task.userstoryEid === this.userstory.eid && task.status === this.status);
	}

	getResponsible(task: TaskSelfComposite): ProjectMemberComposite {
		return this.members.find((member) => member.eid == task.responsibleEid)!;
	}

	getResponsibleFullName(task: TaskSelfComposite): string {
		const responsible = this.getResponsible(task);
		return `${responsible.name} ${responsible.surname}`;
	}
}
