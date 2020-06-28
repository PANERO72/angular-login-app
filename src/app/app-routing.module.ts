import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, data: { titulo: 'Inicio' }, canActivate: [AuthGuard] },
  { path: 'registro', component: RegistroComponent, data: { titulo: 'Registro' } },
  { path: 'login', component: LoginComponent, data: { titulo: 'Iniciar Sesión' } },
  { path: '**', pathMatch: 'full', redirectTo: '/registro' },
  { path: '', pathMatch: 'full', redirectTo: '/registro' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
