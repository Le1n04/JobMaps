// importacion de funciones y clases necesarias de angular y angular fire
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

// definicion de una funcion guard que protege rutas
export const authGuard: CanActivateFn = async () => {
  // inyeccion del servicio de autenticacion
  const auth = inject(Auth);
  // inyeccion del servicio de rutas
  const router = inject(Router);

  // obtiene el usuario autenticado actual
  const user = await new Promise(resolve => {
    const unsub = auth.onAuthStateChanged(u => {
      unsub(); // cancela la suscripcion una vez obtenido el usuario
      resolve(u); // resuelve la promesa con el usuario
    });
  });

  // si hay usuario autenticado, permite el acceso
  if (user) {
    return true;
  } else {
    // si no hay usuario, redirige al login
    await router.navigate(['/login']);
    return false;
  }
};
