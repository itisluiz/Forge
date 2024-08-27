import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { PopupComponent } from "../../popup-component/popup-component";
import { InputComponent } from "../../input-component/input-component";
import { ProjectApiService } from "../../../services/project-api.service";
import { Router } from "@angular/router";
import { ProjectNewRequest } from "forge-shared/dto/request/projectnewrequest.dto";
import { ProjectResponse } from "forge-shared/dto/response/projectresponse.dto";
import { ProjectSelfResponse } from "forge-shared/dto/response/projectselfresponse.dto";
import { ProjectSelfComposite } from "forge-shared/dto/composite/projectselfcomposite.dto";

@Component({
	selector: "app-select-project-page",
	standalone: true,
	imports: [MatIconModule, CommonModule, MatButtonModule, MatMenuModule, PopupComponent, InputComponent],
	templateUrl: "./select-project-page.component.html",
	styleUrl: "./select-project-page.component.scss",
})
export class SelectProjectPageComponent implements OnInit {
	@ViewChild("projectJoin") projectJoin!: InputComponent;

	@ViewChild("projectTitleCreate") projectTitleCreate!: InputComponent;
	@ViewChild("projectDescriptionCreate") projectDescriptionCreate!: InputComponent;
	@ViewChild("projectCodeCreate") projectCodeCreate!: InputComponent;

	public dataSource!: ProjectSelfComposite[];

	popUpJoin: boolean = false;
	popUpCreateProject: boolean = false;
	popUpInvite: boolean = false;

	projectName = "{{projectName}}";

	projectCodeError: string = "";
	projectCreateError: string = "";

	constructor(
		private projectApiService: ProjectApiService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.getProjects();
		console.log(this.dataSource);
	}

	createProject(projectNewRequest: ProjectNewRequest) {
		this.projectApiService.newProject(projectNewRequest).subscribe({
			next: (result) => {
				console.log(result);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	getProjects(): void {
		this.projectApiService.getProject().subscribe({
			next: (response) => {
				this.dataSource = response.projects;
			},
			error: (error) => {
				console.error(error);
			},
		});
	}

	handleButtonClick(buttonAction: string) {
		if (buttonAction === "join") {
			this.handleJoin();
			return;
		}
		if (buttonAction === "create") {
			this.handleCreateProject();
			return;
		}
		if (buttonAction === "invite") {
			return;
		}
	}

	handleCreateProject() {
		const titleValue = this.projectTitleCreate.value;
		const descriptionValue = this.projectDescriptionCreate.value;
		const codeValue = this.projectCodeCreate.value;

		const isCodeValid = this.isValidProjectCode(codeValue);
		const isTitleValid = this.isValidProjectTitle(titleValue);
		const isDescriptionValid = this.isValidProjectDescription(descriptionValue);

		if (isCodeValid && isTitleValid && isDescriptionValid) {
			const request: ProjectNewRequest = {
				title: titleValue,
				description: descriptionValue,
				code: codeValue,
			};

			this.createProject(request);
			this.projectCreateError = "";
		} else {
			// Se algum dos inputs for inválido, atualize a mensagem de erro conforme necessário
			this.projectCreateError = "Invalid input. Please, check your project details and try again.";
			// Lógica adicional para quando algum input é inválido
		}
	}

	handleJoin() {
		const inputValue = this.projectJoin.value;

		if (this.isValidProjectCode(inputValue)) {
			// Lógica para quando o input é válido
			this.projectCodeError = "";
		} else {
			this.projectCodeError = "Invalid project code. Please, try again.";
			// Lógica adicional para quando o input é inválido
		}
	}

	openPopUp(popUp: string) {
		if (popUp === "join") {
			this.popUpJoin = true;
			return;
		}
		if (popUp === "create") {
			this.popUpCreateProject = true;
			return;
		}
		if (popUp === "invite") {
			this.popUpInvite = true;
			return;
		}
	}

	closePopUp(popUp: string) {
		if (popUp === "join") {
			this.popUpJoin = false;
			this.projectCodeError = "";
			return;
		}

		if (popUp === "create") {
			this.popUpCreateProject = false;
			this.projectCreateError = "";
			return;
		}

		if (popUp === "invite") {
			this.popUpInvite = false;
			return;
		}
	}

	isValidProjectTitle(title: string): boolean {
		return title.length >= 3 && title.length <= 100;
	}

	isValidProjectDescription(description: string): boolean {
		return description.length >= 10 && description.length <= 500;
	}

	isValidProjectCode(code: string): boolean {
		return code.length > 1;
	}
}
