// importacion de funciones y clases necesarias de angular
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// importacion del servicio de usuario
import { UserService } from '../services/user.service';

// definicion de una funcion guard que protege rutas durante el flujo de registro
export const registrationFlowGuard: CanActivateFn = () => {
  // inyeccion del servicio de usuario
  const userService = inject(UserService);
  // inyeccion del servicio de rutas
  const router = inject(Router);

  // si el email no esta definido, redirige al login por email
  if (!userService.email) {
    router.navigate(['/email-login']);
    return false; // bloquea el acceso
  }

  return true; // permite el acceso
};
