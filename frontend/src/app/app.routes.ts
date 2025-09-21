import { Routes } from '@angular/router';
import { ProductEntryComponent } from './components/product-entry/product-entry.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { authGuard } from './guards/auth.guards';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocumentManagementComponent } from './components/document-management/document-management.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'product-entry',
    component: ProductEntryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user-registration',
    component: UserRegistrationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'documents',
    component: DocumentManagementComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
];
