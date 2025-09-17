import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductEntryComponent } from './components/product-entry/product-entry.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    // { path: '', redirectTo: 'product-entry', pathMatch: 'full' },
    // { path: 'product-entry', component: ProductEntryComponent },
    // { path: 'user-registration', component: UserRegistrationComponent }  
];


