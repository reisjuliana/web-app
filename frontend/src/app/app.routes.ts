import { Routes } from '@angular/router';
import { ProductEntryComponent } from './components/product-entry/product-entry.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';

export const routes: Routes = [
  { path: '', redirectTo: 'product-entry', pathMatch: 'full' },
  { path: 'product-entry', component: ProductEntryComponent },
  { path: 'user-registration', component: UserRegistrationComponent },
];
