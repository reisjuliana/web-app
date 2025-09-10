import { Component, inject } from '@angular/core';
import { EmailValidator, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

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
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };
  storedUser = {
    email: 'test@gmail.com',
    password: 'password123',
  };

  loginValid: boolean = true;

  router = inject(Router);

  validateLogin(email: string, password: string): boolean {
    return (
      email === this.storedUser.email && password === this.storedUser.password
    );
  }

  login() {
    if (this.validateLogin(this.user.email, this.user.password)) {
      localStorage.setItem('loggedInUser', JSON.stringify(this.user.email));
      this.loginValid = true;
      this.router.navigate(['/dashboard']);
    } else {
      // alert('Incorrect email or password');
      this.loginValid = false;
    }
  }
}
