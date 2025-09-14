import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Defina suas rotas aqui
const routes: Routes = [
  { path: 'product-entry', component: ProductEntryComponent },
  { path: 'user-registration', component: UserRegistrationComponent },
  // Opcional: redirecionar a rota raiz para uma das suas páginas
  { path: '', redirectTo: '/product-entry', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // A LINHA MAIS IMPORTANTE PARA CORRIGIR O ERRO DO ROUTER-OUTLET É ESTA:
  exports: [RouterModule]
})
export class AppRoutingModule { }

