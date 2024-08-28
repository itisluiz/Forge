import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserStoryPopupComponent } from "../../user-story-popup/user-story-popup.component";
import { ActivatedRoute } from "@angular/router";
import { EpicApiService } from "../../../services/epic-api.service";
import { EpicSelfResponse } from "forge-shared/dto/response/epicselfresponse.dto";
import { EpicSelfComposite } from "forge-shared/dto/composite/epicselfcomposite.dto";
import { catchError, combineLatest, Observable, of, shareReplay, switchMap, throwError } from "rxjs";
import { map } from "rxjs";
import { DeletePopupComponent } from "../../delete-popup/delete-popup.component";
import { EpicNewRequest } from "forge-shared/dto/request/epicnewrequest.dto";
import { EpicUpdateRequest } from "forge-shared/dto/request/epicupdaterequest.dto";
import { UserstorySelfComposite } from "forge-shared/dto/composite/userstoryselfcomposite.dto";
import { EpicResponse } from "forge-shared/dto/response/epicresponse.dto";
import { Priority } from "forge-shared/enum/priority.enum";

@Component({
	selector: "app-kanban-page",
	standalone: true,
	imports: [
		NavbarComponent,
		MatIcon,
		MatExpansionModule,
		MatTable,
		MatTableModule,
		MatSelectModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		CommonModule,
		UserStoryPopupComponent,
		DeletePopupComponent,
	],
	templateUrl: "./epics-page.component.html",
	styleUrl: "./epics-page.component.scss",
})
export class EpicsPageComponent implements OnInit {
	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;

	epics$: Observable<EpicSelfComposite[]> = this.epicApiService.getEpics(this.projectEid).pipe(
		map((response: EpicSelfResponse) => {
			return response.epics;
		}),
	);

	userStoriesMap$: Observable<{ [epicEid: string]: UserstorySelfComposite[] }> = new Observable();
	userStoriesDataSources: { [epicEid: string]: MatTableDataSource<UserstorySelfComposite> } = {};

	displayedColumns: string[] = ["key", "title", "description", "priority"];

	popUpCreateEpic: boolean = false;
	popUpIssue: boolean = false;
	popUpDeleteEpic: boolean = false;
	popUpEditEpic: boolean = false;

	createEpicForm!: FormGroup;
	editEpicForm!: FormGroup;

	isPanelDisabled: boolean = false;
	eidSelectedEpic: string = "";

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private epicApiService: EpicApiService,
	) {}

	ngOnInit(): void {
		this.userStoriesMap$ = this.epics$.pipe(
			switchMap((epics) => {
				const userStoriesObservables = epics.map((epic) =>
					this.getUserStories(epic.eid).pipe(
						catchError(() => of([])),
						map((userStories) => ({ [epic.eid]: userStories })),
					),
				);

				return combineLatest(userStoriesObservables).pipe(
					map((userStoriesArray) => userStoriesArray.reduce((acc, curr) => ({ ...acc, ...curr }), {})),
				);
			}),
			shareReplay(1),
		);

		this.userStoriesMap$.subscribe((userStoriesMap) => {
			Object.keys(userStoriesMap).forEach((epicEid) => {
				this.userStoriesDataSources[epicEid] = new MatTableDataSource(userStoriesMap[epicEid]);
			});
		});
	}

	getUserStories(epicEid: string): Observable<UserstorySelfComposite[]> {
		return this.epicApiService.getEpic(this.projectEid, epicEid).pipe(
			map((epicResponse: EpicResponse) => {
				return epicResponse.userstories;
			}),
		);
	}

	priorityParser(priority: number) {
		let pre = "../../../../../assets/";
		let pos = ".svg";
		let priorityName: string;
		switch (priority) {
			case Priority.LOW:
				priorityName = "low";
				break;
			case Priority.MEDIUM:
				priorityName = "medium";
				break;
			case Priority.HIGH:
				priorityName = "high";
				break;
			default:
				throw new Error("Invalid priority");
		}
		return pre + priorityName + pos;
	}

	toggleExpansionPanel() {
		this.isPanelDisabled = !this.isPanelDisabled;
	}

	openPopUpCreateEpic() {
		this.popUpCreateEpic = true;
		document.body.style.overflow = "hidden";
		this.buildCreateEpicForm();
	}

	buildCreateEpicForm() {
		this.createEpicForm = this.formBuilder.group({
			code: ["", [Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
			name: ["", [Validators.required, Validators.minLength(3)]],
			description: ["", [Validators.required, Validators.minLength(3)]],
		});
	}

	openPopUpIssue() {
		this.popUpIssue = true;
		document.body.style.overflow = "hidden";
	}

	openPopUpEditEpic(epicEid: string) {
		this.eidSelectedEpic = epicEid;
		this.toggleExpansionPanel();
		document.body.style.overflow = "hidden";
		this.buildEditEpicForm();
	}

	buildEditEpicForm() {
		this.epicApiService.getEpic(this.projectEid, this.eidSelectedEpic).subscribe({
			next: (epic) => {
				this.editEpicForm = this.formBuilder.group({
					code: [epic.code, [Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
					name: [epic.title, [Validators.required, Validators.minLength(3)]],
					description: [epic.description, [Validators.required, Validators.minLength(3)]],
				});
				this.popUpEditEpic = true;
			},
			error: (error) => {
				console.log(error.error.message);
			},
		});
	}

	openPopUpDeleteEpic(epicEid: string) {
		this.eidSelectedEpic = epicEid;
		this.toggleExpansionPanel();
		this.popUpDeleteEpic = true;
		document.body.style.overflow = "hidden";
	}

	closePopUpCreateEpic() {
		this.popUpCreateEpic = false;
		document.body.style.overflow = "auto";
	}

	closePopUpIssue() {
		this.popUpIssue = false;
		document.body.style.overflow = "auto";
	}

	closePopUpEditEpic() {
		this.popUpEditEpic = false;
		this.toggleExpansionPanel();
		document.body.style.overflow = "auto";
	}

	closePopUpDeleteEpic() {
		this.popUpDeleteEpic = false;
		this.toggleExpansionPanel();
		document.body.style.overflow = "auto";
	}

	submitForm() {
		const code = this.createEpicForm.get("code");
		const name = this.createEpicForm.get("name");
		const description = this.createEpicForm.get("description");

		if (this.createEpicForm.valid) {
			let epicNewRequest = {
				code: code?.value,
				title: name?.value,
				description: description?.value,
			} as EpicNewRequest;
			this.createEpic(epicNewRequest);
		}

		this.closePopUpCreateEpic();
	}

	getUserStoriesDataSource(epicEid: string): MatTableDataSource<UserstorySelfComposite> {
		return this.userStoriesDataSources[epicEid] || new MatTableDataSource([]);
	}

	createEpic(epicNewRequest: EpicNewRequest) {
		this.epicApiService.newEpic(epicNewRequest, this.projectEid).subscribe({
			next: (result) => {
				this.setUpdatedEpics();
				// TODO: Toaster success
			},
			error: (error) => {
				// TODO: Toaster error
				console.log(error.error.message);
			},
		});
	}

	submitEditEpicForm() {
		const code = this.editEpicForm.get("code");
		const name = this.editEpicForm.get("name");
		const description = this.editEpicForm.get("description");

		if (this.editEpicForm.valid) {
			let epicUpdateRequest = {
				code: code?.value,
				title: name?.value,
				description: description?.value,
			} as EpicUpdateRequest;
			this.editEpic(epicUpdateRequest);
		}

		this.closePopUpEditEpic();
	}

	editEpic(epicUpdateRequest: EpicUpdateRequest) {
		this.epicApiService.updateEpic(epicUpdateRequest, this.projectEid, this.eidSelectedEpic).subscribe({
			next: (result) => {
				this.setUpdatedEpics();
				// TODO: Toaster success
			},
			error: (error) => {
				// TODO: Toaster error
				console.log(error.error.message);
			},
		});
	}

	deleteEpic(epicEid: string) {
		this.epicApiService.deleteEpic(epicEid, this.projectEid).subscribe({
			next: (result) => {
				this.setUpdatedEpics();
				// TODO: Toaster success
			},
			error: (error) => {
				// TODO: Toaster error
				console.log(error.error.message);
			},
		});
	}

	onDeleteEpic() {
		this.deleteEpic(this.eidSelectedEpic);
		this.closePopUpDeleteEpic();
	}

	setUpdatedEpics() {
		this.epics$ = this.epicApiService.getEpics(this.projectEid).pipe(
			map((response: EpicSelfResponse) => {
				return response.epics;
			}),
		);
	}

	isFieldInvalid(fieldName: string): boolean {
		let currentForm = null;
		if (this.popUpCreateEpic) {
			currentForm = this.createEpicForm;
		} else {
			currentForm = this.editEpicForm;
		}
		const field = currentForm?.get(fieldName);
		if (!field) {
			return false;
		}
		if (fieldName === "description" && field.value.length === 0) {
			return false;
		}
		return field.invalid && (field.dirty || field.touched);
	}

	getFieldErrorMessage(fieldName: string): string {
		let currentForm = null;
		if (this.popUpCreateEpic) {
			currentForm = this.createEpicForm;
		} else {
			currentForm = this.editEpicForm;
		}
		if (currentForm.get(fieldName)!.errors) {
			return `${fieldName} must have at least 3 characters.`;
		}
		return "";
	}
}
