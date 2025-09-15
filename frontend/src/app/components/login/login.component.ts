import { Component, inject } from '@angular/core';
import { EmailValidator, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginUserDTO } from '../../models/auth.model';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // CORRIGIDO
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };

  loginValid: boolean = true;
  loginSuccess: boolean = false;
  router = inject(Router);
  // authService: any;
  constructor(private authService: AuthService) {}

  login() {
    const loginDTO: LoginUserDTO = {
      email: this.user.email, // pode manter assim
      password: this.user.password,
    };

    this.authService.login(loginDTO).subscribe({
      next: (res: { accessToken: string }) => {
        console.log('Login sucesso:', res);
        this.loginValid = true;
        this.loginSuccess = true;
        localStorage.setItem('accessToken', res.accessToken);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Erro no login:', err);
        this.loginValid = false;
        this.loginSuccess = false;
      },
    });
  }
}
