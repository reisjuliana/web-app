import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };

  loginValid: boolean = true;
  loginSuccess: boolean = false;
  router = inject(Router);

  constructor(private authService: AuthService) {}

  login() {
    const loginDTO: LoginUserDTO = {
      email: this.user.email,
      password: this.user.password,
    };

    this.authService.login(loginDTO).subscribe({
      next: () => {
        this.loginValid = true;
        this.loginSuccess = true;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loginValid = false;
        this.loginSuccess = false;
      },
    });
  }
}
