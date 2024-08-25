import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserStoryPopupComponent } from "../../user-story-popup/user-story-popup.component";
import { ActivatedRoute } from "@angular/router";
import { EpicApiService } from "../../../services/epic-api.service";
import { EpicSelfResponse } from "forge-shared/dto/response/epicselfresponse.dto";
import { EpicSelfComposite } from "forge-shared/dto/composite/epicselfcomposite.dto";
import { Observable } from "rxjs";
import { map } from "rxjs";

export interface History {
	key: string;
	name: string;
	description: string;
	status: string;
	priority: string;
	time_created: string;
}

const HISTORIES_DATA: History[] = [
	{
		key: "HTY-1",
		name: "História 1",
		description: "Descrição 1",
		status: "Backlog",
		priority: "Low",
		time_created: "2024-02-01",
	},
	{
		key: "HTY-2",
		name: "História 2",
		description: "Descrição 2",
		status: "Development",
		priority: "Medium",
		time_created: "2024-02-01",
	},
	{
		key: "HTY-3",
		name: "História 3",
		description: "Descrição 3",
		status: "Production",
		priority: "Medium",
		time_created: "2024-02-01",
	},
	{
		key: "HTY-4",
		name: "História 4",
		description: "Descrição 4",
		status: "Homologation",
		priority: "High",
		time_created: "2024-02-01",
	},
];

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
	],
	templateUrl: "./epics-page.component.html",
	styleUrl: "./epics-page.component.scss",
})
export class EpicsPageComponent implements AfterViewInit, OnInit {
	displayedColumns: string[] = ["key", "name", "description", "status", "priority", "time_created"];
	histories = [...HISTORIES_DATA];

	projectEid: string = this.route.snapshot.paramMap.get("projectEid")!;

	epics$: Observable<EpicSelfComposite[]> = this.epicApiService.getEpics(this.projectEid).pipe(
		map((response: EpicSelfResponse) => {
			return response.epics;
		}),
	);

	@ViewChildren("statusContainer")
	statusContainer!: QueryList<ElementRef>;

	popUpActive: boolean = false;
	popUpIssue: boolean = false;

	createEpicForm!: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private epicApiService: EpicApiService,
	) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		this.statusContainer.forEach((cell) => {
			let color;
			let background;
			let textDecoration;
			let fontWeight;

			switch (cell.nativeElement.textContent.trim()) {
				case "Development": // IN_DEVELOPMENT
					color = "#fff";
					background = "#93C088";
					break;
				case "Homologation": // IN_HOMOLOGATION
					color = "#fff";
					background = "#1A73DC";
					break;
				case "Production": // IN_PRODUCTION
					color = "#fff";
					background = "#187600";
					textDecoration = "line-through";
					break;
				default: // BACKLOG
					color = "#7A7A7A";
					background = "#D8D8D8";
					fontWeight = "400";
			}
			cell.nativeElement.style.backgroundColor = `${background}`;
			cell.nativeElement.style.color = `${color}`;
			cell.nativeElement.style.textDecoration = `${textDecoration}`;
			cell.nativeElement.style.fontWeight = `${fontWeight}`;
		});
	}

	priorityParser(priority: string) {
		let pre = "../../../../../assets/";
		let pos = ".svg";

		return pre + priority.toLowerCase() + pos;
	}

	openPopUp() {
		this.popUpActive = true;
		document.body.style.overflow = "hidden";
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

	closePopUp() {
		this.popUpActive = false;
		document.body.style.overflow = "auto";
	}

	closePopUpIssue() {
		this.popUpIssue = false;
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
			};
			this.epicApiService.newEpic(epicNewRequest, this.projectEid).subscribe({
				next: (result) => {
					console.log(result);
					this.epics$ = this.epicApiService.getEpics(this.route.snapshot.paramMap.get("projectEid")!).pipe(
						map((response: EpicSelfResponse) => {
							return response.epics;
						}),
					);
					// TODO: Toaster success
				},
				error: (error) => {
					// TODO: Toaster error
					console.log(error.error.message);
				},
			});
		}

		this.closePopUp();
	}

	isFieldInvalid(fieldName: string): boolean {
		const field = this.createEpicForm.get(fieldName);
		if (!field) {
			return false;
		}
		if (fieldName === "description" && field.value.length === 0) {
			return false;
		}
		return field.invalid && (field.dirty || field.touched);
	}

	getFieldErrorMessage(fieldName: string): string {
		if (this.createEpicForm.get(fieldName)!.errors) {
			return `${fieldName} must have at least 3 characters.`;
		}
		return "";
	}
}
