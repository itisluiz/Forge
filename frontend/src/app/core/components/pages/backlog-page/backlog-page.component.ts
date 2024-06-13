import { Component, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, Renderer2 } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTable, MatTableModule } from "@angular/material/table";

export interface History {
	type: string;
	key: string;
	subject: string;
	description: string;
	status: string;
	assignee: string;
	priority: string;
	created: string;
}

const historiesData: History[] = [
	{
		type: "Feature",
		key: "TASK-001",
		subject: "Implement login functionality",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "In Progress",
		assignee: "John Doe",
		priority: "High",
		created: "2022-01-01",
	},
	{
		type: "Bug",
		key: "BUG-001",
		subject: "Fix navigation bar alignment",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "Backlog",
		assignee: "Jane Smith",
		priority: "Medium",
		created: "2022-01-02",
	},
	{
		type: "Tests",
		key: "BUG-001",
		subject: "Fix navigation bar alignment",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "Done",
		assignee: "Jane Smith",
		priority: "Low",
		created: "2022-01-02",
	},
	{
		type: "Feature",
		key: "TASK-001",
		subject: "Implement login functionality",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "In Progress",
		assignee: "John Doe",
		priority: "High",
		created: "2022-01-01",
	},
	{
		type: "Feature",
		key: "BUG-001",
		subject: "Fix navigation bar alignment",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "In Progress",
		assignee: "Jane Smith",
		priority: "Medium",
		created: "2022-01-02",
	},
	{
		type: "Tests",
		key: "BUG-001",
		subject: "Fix navigation bar alignment",
		description: "Como usuário, desejo um novo menu para cadastro de tarefas que seja intuitivo e eficiente.",
		status: "Done",
		assignee: "Jane Smith",
		priority: "Low",
		created: "2022-01-02",
	},
];

@Component({
	selector: "app-backlog-page",
	standalone: true,
	imports: [NavbarComponent, MatIcon, MatExpansionModule, MatTableModule],
	templateUrl: "./backlog-page.component.html",
	styleUrl: "./backlog-page.component.scss",
})
export class BacklogPageComponent implements AfterViewInit {
	@ViewChildren("itemCell")
	itemCell!: QueryList<ElementRef>;

	@ViewChildren("statusContainer")
	statusContainer!: QueryList<ElementRef>;

	@ViewChildren("statusPopUp")
	statusPopUp!: QueryList<ElementRef>;

	@ViewChild(MatTable)
	table!: MatTable<History>;

	constructor(private renderer: Renderer2) {}

	displayedColumns: string[] = ["type", "key", "subject", "status", "assignee", "priority", "created"];
	dataSource = [...historiesData];

	popUpActive: boolean = false;
	clickedItemDetails: History = {
		type: "",
		key: "",
		subject: "",
		description: "",
		status: "",
		assignee: "",
		priority: "",
		created: "",
	};

	ngAfterViewInit(): void {
		this.setTypeColor();
		this.setStatusStyle();
		this.popUpController();
	}

	popUpController() {
		let elements = document.querySelectorAll(".mat-mdc-row");
		const fields = ["type", "key", "subject", "status", "assignee", "priority", "created"];

		elements.forEach((element) => {
			this.renderer.listen(element, "click", (): any => {
				const content = element.querySelectorAll(".mat-mdc-cell");
				let array: any[] = [];

				content.forEach((cell, index) => {
					let text = cell.textContent?.trim() ?? "";
					let svgName = "";

					if (index === 5) {
						const child = cell.firstElementChild;

						if (child instanceof HTMLImageElement) {
							const src = child.src;
							svgName = src.substring(src.lastIndexOf("/") + 1).replace(".svg", "");
						}
					}

					if (svgName != "") {
						text = svgName;
					}

					array.push(text);

					if (index < fields.length) {
						if (text !== "") {
							this.clickedItemDetails[fields[index] as keyof History] = text;
						}
					}
				});

				this.openPopUp();

				setTimeout(() => {
					this.setStatusStylePopUp(element);
				}, 0);

				return this.clickedItemDetails;
			});
		});
	}

	openPopUp() {
		this.popUpActive = true;
	}

	closePopUp() {
		let backgroundPopUp = document.querySelector(".pop-up-background");
		if (backgroundPopUp) {
			backgroundPopUp.classList.add("fade-opacity");
		}

		let popUp = document.querySelector(".history-pop-up");
		if (popUp) {
			popUp.classList.add("fade-out");
		}
		setTimeout(() => {
			this.popUpActive = false;
		}, 200);
	}

	setTypeColor() {
		this.itemCell.forEach((cell) => {
			let color;
			switch (cell.nativeElement.textContent.trim()) {
				case "Feature":
					color = "#6dc955";
					break;
				case "Bug":
					color = "#CA7B1D";
					break;
				default:
					color = "#1A73DC";
			}
			cell.nativeElement.style.borderLeft = `4px solid ${color}`;
		});
	}

	setStatusStyle() {
		this.statusContainer.forEach((cell) => {
			const { color, background, textDecoration, fontWeight } = this.determineStyle(cell.nativeElement.textContent.trim());
			cell.nativeElement.style.backgroundColor = `${background}`;
			cell.nativeElement.style.color = `${color}`;
			cell.nativeElement.style.textDecoration = `${textDecoration}`;
			cell.nativeElement.style.fontWeight = `${fontWeight}`;
		});
	}

	setStatusStylePopUp(element: any) {
		const status = element.querySelector(".mat-mdc-cell:nth-child(4)");
		const { color, background, textDecoration, fontWeight } = this.determineStyle(status.textContent.trim());

		const currentStatus = document.getElementById("container-status-pop");
		if (currentStatus) {
			currentStatus.style.backgroundColor = `${background}`;
			currentStatus.style.color = `${color}`;
			currentStatus.style.textDecoration = `${textDecoration}`;
			currentStatus.style.fontWeight = `${fontWeight}`;
		}
	}

	priorityParser(priority: string) {
		let pre = "../../../../../assets/";
		let pos = ".svg";

		return pre + priority.toLowerCase() + pos;
	}

	determineStyle(status: string) {
		let color;
		let background;
		let textDecoration;
		let fontWeight;

		switch (status) {
			case "In Progress":
			case "Available to review":
			case "In review":
				color = "#fff";
				background = "#93C088";
				break;
			case "Done":
				color = "#fff";
				background = "#187600";
				textDecoration = "line-through";
				break;
			default:
				color = "#7A7A7A";
				background = "#D8D8D8";
				fontWeight = "400";
		}

		return { color, background, textDecoration, fontWeight };
	}
}
