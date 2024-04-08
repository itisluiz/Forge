import { Routes } from "@angular/router";
import { LoginPageComponent } from "./core/components/pages/login-page/login-page.component";
import { MainPageComponent } from "./core/components/pages/main-page/main-page.component";
import { AgileProcessComponent } from "./core/components/agile-process/agile-process.component";

export const routes: Routes = [
	{ path: "", component: MainPageComponent },
	{ path: "login", component: LoginPageComponent },
	{ path: "agile", component: AgileProcessComponent },
];
