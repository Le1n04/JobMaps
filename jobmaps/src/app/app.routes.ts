import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { registrationFlowGuard } from './guards/registration-flow.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'email-login',
    loadComponent: () =>
      import('./pages/email-login/email-login.component').then(
        (m) => m.EmailLoginComponent
      ),
    canActivate: [noAuthGuard],
  },
  {
    path: 'email-password',
    loadComponent: () =>
      import('./pages/email-password/email-password.component').then(
        (m) => m.EmailPasswordComponent
      ),
    canActivate: [registrationFlowGuard],
  },
  {
    path: 'register-step1',
    loadComponent: () =>
      import('./pages/register-step1/register-step1.component').then(
        (m) => m.RegisterStep1Component
      ),
    canActivate: [registrationFlowGuard],
  },
  {
    path: 'register-location',
    loadComponent: () =>
      import('./pages/register-location/register-location.component').then(
        (m) => m.RegisterLocationComponent
      ),
    canActivate: [registrationFlowGuard],
  },
  {
    path: 'register-password',
    loadComponent: () =>
      import('./pages/register-password/register-password.component').then(
        (m) => m.RegisterPasswordComponent
      ),
    canActivate: [registrationFlowGuard],
  },
  {
    path: 'select-location',
    loadComponent: () =>
      import(
        './pages/select-location/select-location/select-location.component'
      ).then((m) => m.SelectLocationComponent),
    canActivate: [registrationFlowGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
