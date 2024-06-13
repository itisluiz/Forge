import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { NewUserStory } from "forge-shared/dto/newuserstory.dto";
import { RouterModule } from "@angular/router";

@Component({
	selector: "app-createuserstory-page",
	standalone: true,
	imports: [FormsModule, RouterModule],
	templateUrl: "./createuserstory-page.component.html",
	styleUrl: "./createuserstory-page.component.scss",
})
export class CreateuserstoryPageComponent {
	constructor(public apiService: ApiService) {}

	public story = { title: "", description: "", actor: "", objective: "", justification: "" };
	public acceptanceCriteria: { given: string; when: string; then: string }[] = [];
	public newAcceptanceCriteria: { given: string; when: string; then: string } = { given: "", when: "", then: "" };

	public addAcceptanceCriteria() {
		if (!this.newAcceptanceCriteria.given || !this.newAcceptanceCriteria.when || !this.newAcceptanceCriteria.then) {
			return;
		}
		this.acceptanceCriteria.push(this.newAcceptanceCriteria);
		this.newAcceptanceCriteria = { given: "", when: "", then: "" };
	}

	public removeAcceptanceCriteria() {
		this.acceptanceCriteria.pop();
	}

	public saveUserStory() {
		if (
			!this.story.title ||
			!this.story.description ||
			!this.story.actor ||
			!this.story.objective ||
			!this.story.justification ||
			this.acceptanceCriteria.length === 0
		) {
			alert("Fill all the fields");
			return;
		}

		const newUserStory: NewUserStory = {
			...this.story,
			acceptanceCriteria: this.acceptanceCriteria,
		};

		this.apiService.call("POST", "userstory", undefined, newUserStory).subscribe(() => {
			alert("User story created");
		});
	}
}
