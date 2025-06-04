// importacion de decoradores y clases de angular
import { Injectable } from '@angular/core';
// importacion de guardia y router de angular
import { CanActivate, Router } from '@angular/router';
// importacion del servicio de usuario
import { UserService } from '../services/user.service';

// decorador para indicar que el servicio esta disponible en toda la aplicacion
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  // inyeccion de dependencias: servicio de usuario y router
  constructor(private userService: UserService, private router: Router) {}

  // metodo que determina si se puede activar la ruta, soporta operaciones asincronas
  async canActivate(): Promise<boolean> {
    // espera a que el usuario este completamente cargado
    await this.userService.usuarioCargado;

    // verifica si el rol del usuario es admin
    if (this.userService.role === 'admin') {
      return true; // permite el acceso
    } else {
      this.router.navigate(['/home']); // redirige al home si no es admin
      return false; // bloquea el acceso
    }
  }
}
