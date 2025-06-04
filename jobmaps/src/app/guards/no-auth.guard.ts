// importacion de funciones y clases necesarias de angular
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
// importacion del servicio de autenticacion personalizado
import { AuthService } from '../services/auth.service';
// importacion del servicio de rutas
import { Router } from '@angular/router';

// definicion de una funcion guard que protege rutas para usuarios no autenticados
export const noAuthGuard: CanActivateFn = async () => {
  // inyeccion del servicio de autenticacion
  const authService = inject(AuthService);
  // inyeccion del servicio de rutas
  const router = inject(Router);

  // obtiene el usuario autenticado actual
  const user = await new Promise(resolve => {
    const unsub = authService['auth'].onAuthStateChanged(u => {
      unsub(); // cancela la suscripcion una vez obtenido el usuario
      resolve(u); // resuelve la promesa con el usuario
    });
  });

  // si hay usuario autenticado, redirige al home
  if (user) {
    router.navigate(['/home']);
    return false; // bloquea el acceso
  } else {
    return true; // permite el acceso
  }
};
