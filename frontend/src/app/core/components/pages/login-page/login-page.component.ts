import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { LoginServiceService } from "../../../services/login-service/login-service.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-login-page",
	standalone: true,
	imports: [
		ReactiveFormsModule, 
		CommonModule, 
		MatIconModule
	],
	providers: [LoginServiceService],
	templateUrl: "./login-page.component.html",
	styleUrl: "./login-page.component.scss",
})
export class LoginPageComponent implements OnInit {
	loginForm!: FormGroup;
	loginFailed: boolean = false;
	formSubmitted: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private loginService: LoginServiceService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=.*[^A-Za-z0-9]).{7,}$/)]],
		});

		this.loginForm.get("email")!.valueChanges.subscribe(() => {
			this.loginFailed = false;
		});

		this.loginForm.get("password")!.valueChanges.subscribe(() => {
			this.loginFailed = false;
		});
	}

	submitForm() {
		console.log(this.loginForm.value) //TODO remover
		this.loginService.login(this.loginForm.get("email")!.value, this.loginForm.get("password")!.value).subscribe({
			next: () => {
				console.log('sucesso tipo Lino oi')
				this.loginFailed = false;
				// Redirecionar para a página principal
			},
			error: () => {
				this.loginFailed = true;
				console.log('error tipo Lino oi')
				// sepa adicionar uma snackbar
			},
		});
	}

	navigate(){
		this.router.navigate(['/signup'])
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
			// Lógica para autenticação aqui
			// Se a autenticação falhar, defina loginFailed como verdadeiro
			this.loginFailed = true;
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
