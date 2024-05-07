import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-signup-page",
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, MatIconModule],
	templateUrl: "./signup-page.component.html",
	styleUrl: "./signup-page.component.scss",
})
export class SignupPageComponent implements OnInit {
	signupForm!: FormGroup;
	signupFailed: boolean = false;
	formSubmitted: boolean = false;
	regexName: RegExp = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
	regexPassword: RegExp = /^(?=.*[!@#$%^&*]).{7,}$/;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.signupForm = this.formBuilder.group({
			name: ["", [Validators.required, Validators.minLength(3), Validators.pattern(this.regexName)]],
			lastName: ["", [Validators.required, Validators.minLength(3), Validators.pattern(this.regexName)]],
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(7), Validators.pattern(this.regexPassword)]],
			passwordConfirm: ["", [Validators.required, Validators.minLength(7), Validators.pattern(this.regexPassword)]],
		}, { validator: this.checkPasswords });

		this.signupForm.get("name")!.valueChanges.subscribe(() => {
			this.signupFailed = false;
		});

		this.signupForm.get("lastName")!.valueChanges.subscribe(() => {
			this.signupFailed = false;
		});

		this.signupForm.get("email")!.valueChanges.subscribe(() => {
			this.signupFailed = false;
		});

		this.signupForm.get("password")!.valueChanges.subscribe(() => {
			this.signupFailed = false;
		});

		this.signupForm.get("passwordConfirm")!.valueChanges.subscribe(() => {
			this.signupFailed = false;
		});
	}

	isFieldInvalid(field: string): boolean {
		const formField = this.signupForm.get(field);
		
		if (field === 'name' || field === 'lastName') {
		  return !formField!.value.match(this.regexName) && (formField!.dirty || formField!.touched);

		} else if (field === 'email') {
		  return formField!.errors?.["email"] && (formField!.dirty || formField!.touched);

		} else if (field === 'password' || field === 'passwordConfirm') {
			if (formField?.value.length === 0) {
				return false;
			}
		  return formField!.invalid && (formField!.dirty || formField!.touched);
		}
		return false;
	}


	checkPasswords(signupForm: FormGroup) {
		const password = signupForm.get('password')?.value;
		const confirmPassword = signupForm.get('passwordConfirm')?.value;

		return password === confirmPassword ? true : false;
	}

	signup() {
		const password = this.signupForm.get("password");
		this.formSubmitted = true;
		if (this.signupForm.invalid && password?.value.length === 0) {
			return;
		}
		if (this.signupForm.valid) {
			// Lógica para autenticação aqui
			// Se a autenticação falhar, defina signupFailed como verdadeiro
			this.signupFailed = true;
		}
	}

	get nameErrorMessage(): string {
		if (!this.signupForm.get("name")!.value.match(this.regexName)) {
			return "Please enter a valid name.";
		}
		return "";
	}

	get lastNameErrorMessage(): string {
		if (!this.signupForm.get("lastName")!.value.match(this.regexName)) {
			return "Please enter a valid last name.";
		}
		return "";
	}

	get emailErrorMessage(): string {
		if (this.signupForm.get("email")!.errors?.["email"]) {
			return "Please enter a valid email address.";
		}
		return "";
	}

	get passwordErrorMessage(): string {
		if (this.signupForm.get("password")!.errors?.["pattern"] || this.signupForm.get("passwordConfirm")!.errors?.["pattern"]) {
			return "Password must have 7 characters and 1 special character.";
		}
		return "";
	}

	get overallErrorMessage(): string {
		const password = this.signupForm.get("password");
		const passwordConfirm = this.signupForm.get("passwordConfirm");
		
		if (this.signupFailed && password?.value !== passwordConfirm?.value) {
			return "Your passwords must be equals. Please try again.";
		}
		return "Invalid email or password. Please try again.";
	}
}
