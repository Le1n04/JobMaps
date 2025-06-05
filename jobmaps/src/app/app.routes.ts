// importacion de rutas y guards
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { registrationFlowGuard } from './guards/registration-flow.guard';
import { AdminGuard } from './guards/admin.guard';

// definicion de las rutas principales de la aplicacion
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard], // requiere estar autenticado
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [noAuthGuard], // solo accesible si no estas autenticado
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./pages/favoritos-page/favoritos-page.component').then(
        (m) => m.FavoritosPageComponent
      ),
    canActivate: [authGuard], // requiere estar autenticado
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    canActivate: [AdminGuard], // requiere ser administrador
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import(
        './pages/notificaciones-empresa/notificaciones-empresa.component'
      ).then((m) => m.NotificacionesEmpresaComponent),
    canActivate: [authGuard], // requiere estar autenticado
  },
  {
    path: 'email-login',
    loadComponent: () =>
      import('./pages/email-login/email-login.component').then(
        (m) => m.EmailLoginComponent
      ),
    canActivate: [noAuthGuard], // solo accesible si no estas autenticado
  },
  {
    path: 'email-password',
    loadComponent: () =>
      import('./pages/email-password/email-password.component').then(
        (m) => m.EmailPasswordComponent
      ),
    canActivate: [registrationFlowGuard], // requiere completar flujo de registro
  },
  {
    path: 'profile-settings',
    loadComponent: () =>
      import('./pages/profile-settings/profile-settings.component').then(
        (m) => m.ProfileSettingsComponent
      ),
    canActivate: [authGuard], // requiere estar autenticado
  },
  {
    path: 'register-step1',
    loadComponent: () =>
      import('./pages/register-step1/register-step1.component').then(
        (m) => m.RegisterStep1Component
      ),
    canActivate: [registrationFlowGuard], // requiere completar flujo de registro
  },
  {
    path: 'register-location',
    loadComponent: () =>
      import('./pages/register-location/register-location.component').then(
        (m) => m.RegisterLocationComponent
      ),
    canActivate: [registrationFlowGuard], // requiere completar flujo de registro
  },
  {
    path: 'register-password',
    loadComponent: () =>
      import('./pages/register-password/register-password.component').then(
        (m) => m.RegisterPasswordComponent
      ),
    canActivate: [registrationFlowGuard], // requiere completar flujo de registro
  },
  {
    path: 'select-location',
    loadComponent: () =>
      import(
        './pages/select-location/select-location/select-location.component'
      ).then((m) => m.SelectLocationComponent),
    canActivate: [registrationFlowGuard], // requiere completar flujo de registro
  },
  {
    path: 'crear-oferta',
    loadComponent: () =>
      import('./pages/crear-oferta/crear-oferta.component').then(
        (m) => m.CrearOfertaComponent
      ),
    canActivate: [authGuard], // requiere estar autenticado
    // se puede añadir un roleGuard para limitar a empresas
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    // ruta comodin: redirige a login
  },
];
