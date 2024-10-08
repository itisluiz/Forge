import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { UserApiService } from "../../../services/user-api.service";
import { UserSigninRequest } from "forge-shared/dto/request/usersigninrequest.dto";
import { ApiErrorResponse } from "../../../services/api.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-login-page",
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, MatIconModule],
	templateUrl: "./login-page.component.html",
	styleUrl: "./login-page.component.scss",
})
export class LoginPageComponent implements OnInit {
	loginForm!: FormGroup;
	loginFailed: boolean = false;
	formSubmitted: boolean = false;
	public loginLoading: boolean = false;
	passwordFieldType: string = "password";

	constructor(
		private userApiService: UserApiService,
		private formBuilder: FormBuilder,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(1)]],
		});
	}

	login() {
		const password = this.loginForm.get("password");
		this.formSubmitted = true;
		if (this.loginForm.invalid && password?.value.length === 0) {
			return;
		}
		if (this.loginForm.valid) {
			const request: UserSigninRequest = {
				email: this.loginForm.get("email")!.value,
				password: this.loginForm.get("password")!.value,
			};

			this.loginLoading = true;
			this.userApiService.signin(request).subscribe({
				next: (result) => {
					this.router.navigate(["/select-project"]);
					this.loginLoading = false;
				},
				error: (error: ApiErrorResponse) => {
					this.loginFailed = true;
					this.loginLoading = false;
				},
			});
		}
	}

	togglePasswordVisibility(): void {
		this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}

	get genericErrorMessage(): string {
		if (this.loginFailed === true) {
			return "Invalid email or password. Please try again.";
		}
		return "";
	}
}
