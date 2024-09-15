import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noSequentialNumbersValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		if (value && /12345|23456|34567|45678|56789/.test(value)) {
			return { sequentialNumbers: true };
		}
		return null;
	};
}
