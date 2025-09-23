import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../services/user.service';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent implements OnInit {
  userForm: FormGroup;
  users = new MatTableDataSource<User>();
  displayedColumns: string[] = ['id', 'name', 'email', 'cpf'];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpf: ['', [Validators.required, this.cpfValidator]],
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => (this.users.data = users),
      error: (err) => console.error('Erro ao carregar usuários:', err),
    });
  }

  cpfValidator(control: any) {
    const cpf = control.value?.replace(/\D/g, '');
    if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { invalidCpf: true };
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += Number(cpf.charAt(i)) * (10 - i);
    }
    let firstCheck = (sum * 10) % 11;
    if (firstCheck === 10 || firstCheck === 11) firstCheck = 0;
    if (firstCheck !== Number(cpf.charAt(9))) {
      return { invalidCpf: true };
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += Number(cpf.charAt(i)) * (11 - i);
    }
    let secondCheck = (sum * 10) % 11;
    if (secondCheck === 10 || secondCheck === 11) secondCheck = 0;
    if (secondCheck !== Number(cpf.charAt(10))) {
      return { invalidCpf: true };
    }
    return null;
  }

  formatCpf(event: any) {
    const value = this.formatCpfValue(event.target.value);
    event.target.value = value;
    this.userForm.patchValue({ cpf: value });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      this.userService.createUser(user).subscribe({
        next: () => {
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => console.error('Erro ao criar usuário:', err),
      });
    }
  }

  onCancel() {
    this.resetForm();
  }

  private resetForm() {
    this.userForm.reset({
      name: '',
      email: '',
      password: '',
      cpf: '',
    });

    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();

    Object.keys(this.userForm.controls).forEach((key) => {
      this.userForm.get(key)?.setErrors(null);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
  }

  formatCpfValue(cpf: string): string {
    return cpf
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
}
