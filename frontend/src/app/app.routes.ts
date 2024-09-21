import { Routes } from "@angular/router";
import { LoginPageComponent } from "./core/components/pages/login-page/login-page.component";
import { MainPageComponent } from "./core/components/pages/main-page/main-page.component";
import { KanbanPageComponent } from "./core/components/pages/kanban-page/kanban-page.component";
import { EpicsPageComponent } from "./core/components/pages/epic-page/epics-page.component";
import { BacklogPageComponent } from "./core/components/pages/backlog-page/backlog-page.component";
import { SignupPageComponent } from "./core/components/pages/signup-page/signup-page.component";
import { SelectProjectPageComponent } from "./core/components/pages/select-project-page/select-project-page.component";
import { UserStoryPageComponent } from "./core/components/pages/user-story-page/user-story-page.component";
import { UserStoryPopupComponent } from "./core/components/user-story-popup/user-story-popup.component";
import { PlanningPokerPageComponent } from "./core/components/pages/planning-poker-page/planning-poker-page.component";

export const routes: Routes = [
	//{ path: "", component: MainPageComponent },
	{ path: "login", component: LoginPageComponent },
	{ path: ":projectEid/kanban", component: KanbanPageComponent },
	{ path: ":projectEid/epics", component: EpicsPageComponent },
	{ path: ":projectEid/backlog", component: BacklogPageComponent },
	{ path: "signup", component: SignupPageComponent },
	{ path: "select-project", component: SelectProjectPageComponent },
	{ path: ":projectEid/:userstoryEid/user-story", component: UserStoryPageComponent },
	{ path: "user-story-popup", component: UserStoryPopupComponent },
	{ path: ":projectEid/planning-poker", component: PlanningPokerPageComponent },
	{ path: "planning-poker/:projectEid/:session", component: PlanningPokerPageComponent },
	{ path: "**", redirectTo: "/select-project" },
];
