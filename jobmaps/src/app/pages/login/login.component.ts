// importacion de decoradores y modulos de angular
import { Component, inject, OnInit } from '@angular/core';
// importacion del servicio de autenticacion personalizado
import { AuthService } from '../../services/auth.service';
// importacion del servicio de rutas de angular
import { Router, RouterModule } from '@angular/router';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-login', // selector para usar el componente en html
  templateUrl: './login.component.html', // ruta del template html
  styleUrl: './login.component.scss', // ruta del archivo de estilos
  standalone: true, // componente independiente
  imports: [
    RouterModule
  ]
})
export class LoginComponent implements OnInit {
  // inyeccion de servicios
  private authService = inject(AuthService);
  private router = inject(Router);

  // metodo que se ejecuta al iniciar el componente
  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.router.navigate(['/home']); // si el usuario esta logueado, redirige al home
    }
  }

  // metodo para iniciar sesion con google
  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
