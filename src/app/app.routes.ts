import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home';
import { CreateUserComponent } from './create-user/create-user';
import { authGuard } from './auth-guard';
import { TemporaryContentComponent } from './temporary-content/temporary-content';
import { CarRegistrationComponent } from './car-registration/car-registration';

import { ClientsComponent } from './clients/clients';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'create-user',
    component: CreateUserComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'clientes',
    component: ClientsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'registro-autos',
    component: CarRegistrationComponent,
    canActivate: [authGuard]
  },
  {
    path: 'expedientes',
    component: TemporaryContentComponent,
    canActivate: [authGuard]
  },
  {
    path: 'citas',
    component: TemporaryContentComponent,
    canActivate: [authGuard]
  },
  {
    path: 'servicios',
    component: TemporaryContentComponent,
    canActivate: [authGuard]
  },
  {
    path: 'inventario',
    component: TemporaryContentComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];