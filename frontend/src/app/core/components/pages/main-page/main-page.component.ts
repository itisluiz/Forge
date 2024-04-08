import { Component } from "@angular/core";
import { AgileProcessComponent } from "../../agile-process/agile-process.component";
import { NavbarComponent } from "../../navbar/navbar.component";
import { GalleryModule } from "ng-gallery";

@Component({
	selector: "app-main-page",
	standalone: true,
	imports: [AgileProcessComponent, NavbarComponent, GalleryModule],
	templateUrl: "./main-page.component.html",
	styleUrl: "./main-page.component.scss",
})
export class MainPageComponent {}
