import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";

@Component({
	selector: "app-navbar",
	standalone: true,
	imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule],
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {}
