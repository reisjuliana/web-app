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

  displayedColumns: string[] = ['id', 'nome', 'email', 'cpf'];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpf: ['', [Validators.required, this.cpfValidator]],
      sn_ativo: [true],
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.users.data = users;
    });
  }

  cpfValidator(control: any) {
    const cpf = control.value?.replace(/\D/g, '');
    if (!cpf || cpf.length !== 11) {
      return { invalidCpf: true };
    }

    // Basic CPF validation
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { invalidCpf: true };
    }

    return null;
  }

  formatCpf(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    event.target.value = value;
    this.userForm.patchValue({ cpf: value });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const user: User = {
        ...formValue,
        id: this.userService.generateUserId(formValue.nome),
        activationDate: formValue.sn_ativo ? new Date() : undefined,
      };

      this.userService.createUser(user).subscribe({
        next: () => {
          this.loadUsers();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating user:', error);
        },
      });
    }
  }

  onCancel() {
    this.resetForm();
  }

  private resetForm() {
    this.userForm.reset();
    this.userForm.patchValue({ sn_ativo: true });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
  }

  getStatusText(active: boolean): string {
    return active ? 'Ativo' : 'Inativo';
  }

  getStatusColor(active: boolean): string {
    return active ? 'primary' : 'warn';
  }
}
