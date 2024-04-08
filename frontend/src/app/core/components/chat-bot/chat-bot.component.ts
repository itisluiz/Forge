import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-chat-bot",
	standalone: true,
	imports: [MatIconModule],
	templateUrl: "./chat-bot.component.html",
	styleUrl: "./chat-bot.component.scss",
})
export class ChatBotComponent implements OnInit {
	isChatOpen: boolean = false;
	expandIcon: string = "expand_more";

	@ViewChild("text")
	textArea!: ElementRef;

	constructor(private renderer: Renderer2) {}

	ngOnInit(): void {
		this.renderer.listen(this.textArea.nativeElement, "input", (event) => {
			setTimeout(() => this.autoResize(), 0);
		});
	}

	autoResize() {
		this.renderer.setStyle(this.textArea.nativeElement, "height", "auto");
		this.renderer.setStyle(this.textArea.nativeElement, "height", `${this.textArea.nativeElement.scrollHeight}px`);
	}

	toggleChat(): void {
		this.isChatOpen = !this.isChatOpen;

		const chatBotBody = document.getElementsByClassName("chat-bot-body")[0] as HTMLElement;
		const chatBotInput = document.getElementsByClassName("input")[0] as HTMLInputElement;
		if (chatBotBody) {
			if (this.isChatOpen) {
				chatBotBody.classList.remove("closed");
				chatBotInput.style.display = "block";
			} else {
				chatBotBody.classList.add("closed");
				chatBotInput.style.display = "none";
			}
			chatBotBody.style.height = this.isChatOpen ? "calc(100svh - 105px)" : "0";
			this.expandIcon = this.isChatOpen ? "expand_less" : "expand_more";
		}
	}
}
