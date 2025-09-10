// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginUserDTO, RegisterUserDTO } from '../dtos/auth.dtos';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; // usa o environment

  constructor(private http: HttpClient) {}

  register(user: RegisterUserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: LoginUserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }
}
