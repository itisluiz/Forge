import { Routes } from "@angular/router";
import { LoginPageComponent } from "./core/components/pages/login-page/login-page.component";
import { MainPageComponent } from "./core/components/pages/main-page/main-page.component";
import { AgileProcessComponent } from "./core/components/agile-process/agile-process.component";
import { KanbanPageComponent } from "./core/components/pages/kanban-page/kanban-page.component";
import { EpicsPageComponent } from "./core/components/pages/epic-page/epics-page.component";
import { BacklogPageComponent } from "./core/components/pages/backlog-page/backlog-page.component";
import { SignupPageComponent } from "./core/components/pages/signup-page/signup-page.component";

export const routes: Routes = [
	{ path: "", component: MainPageComponent},
	{ path: "login", component: LoginPageComponent},
	{ path: "agile", component: AgileProcessComponent },
	{ path: "kanban", component: KanbanPageComponent},
	{ path: "epics", component: EpicsPageComponent},
	{ path: "backlog", component: BacklogPageComponent},
	{ path: "signup", component: SignupPageComponent},
	{ path: "**", redirectTo: "/"},
];