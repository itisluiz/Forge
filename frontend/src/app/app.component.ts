import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { AgileProcessComponent } from "./core/components/agile-process/agile-process.component";
import { NavbarComponent } from "./core/components/navbar/navbar.component";

@Component({
	selector: "app-root",
	standalone: true,
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
	imports: [CommonModule, RouterOutlet, AgileProcessComponent, NavbarComponent],
})
export class AppComponent {
	title = "forge-frontend";
}
