import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginUserDTO, RegisterUserDTO } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // Rota de registro (POST /auth/register)
  register(dto: RegisterUserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, dto);
  }

  // Rota de login (POST /auth/login)
  login(dto: LoginUserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, dto);
  }
}
