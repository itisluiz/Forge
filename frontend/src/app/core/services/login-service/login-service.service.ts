import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../../types/login-response.type';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private httpClient: HttpClient) {  }

  login(name: string, password: string) {
    return this.httpClient.post<LoginResponse>('http://localhost:3000/login', { name, password }).pipe(
      tap((value) => {
        sessionStorage.setItem('auth-token', value.token);
        sessionStorage.setItem('user', JSON.stringify(value.user));
      })
    );
  }
}
