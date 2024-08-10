import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { UserApiService } from "../../../services/user-api.service";
import { UserSigninRequest } from "forge-shared/dto/request/usersigninrequest.dto";
import { ApiErrorResponse } from "../../../services/api.service";

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

	constructor(
		private userApiService: UserApiService,
		private formBuilder: FormBuilder,
	) {}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=.*[!@#$%^&*]).{7,}$/)]],
		});

		this.loginForm.get("email")!.valueChanges.subscribe(() => {
			this.loginFailed = false;
		});

		this.loginForm.get("password")!.valueChanges.subscribe(() => {
			this.loginFailed = false;
		});
	}

	isEmailInvalid(): boolean {
		const email = this.loginForm.get("email");
		if (!email!.errors?.["email"]) {
			return false;
		}
		return email!.invalid && (email!.dirty || email!.touched);
	}

	isPasswordInvalid(): boolean {
		const password = this.loginForm.get("password");
		if (password?.value.length === 0) {
			return false;
		}
		return password!.invalid && (password!.dirty || password!.touched);
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

			this.userApiService.signin(request).subscribe({
				next: (result) => {},
				error: (error: ApiErrorResponse) => {},
			});

			// TODO: Entender por que isso existe
			// this.loginFailed = true;
		}
	}

	get emailErrorMessage(): string {
		if (this.loginForm.get("email")!.errors?.["email"]) {
			return "Please enter a valid email address.";
		}
		return "";
	}

	get passwordErrorMessage(): string {
		if (this.loginForm.get("password")!.errors?.["pattern"]) {
			return "Password must have 7 characters and 1 special character.";
		}
		return "Invalid email or password. Please try again.";
	}
}
