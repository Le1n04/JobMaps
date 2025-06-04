// importacion de decoradores y modulos de angular
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// importacion de servicios de rutas de angular
import { Router, ActivatedRoute } from '@angular/router';
// importacion de clases y funciones de autenticacion de firebase
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
// importacion de servicios personalizados
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';

// decorador que define las propiedades del componente
@Component({
  standalone: true, // componente independiente
  selector: 'app-email-password', // selector para usar el componente en html
  templateUrl: './email-password.component.html', // ruta del template html
  styleUrls: ['./email-password.component.scss'], // ruta de los estilos
  imports: [FormsModule], // modulos importados
})
export class EmailPasswordComponent {
  // variable para almacenar la contraseña introducida
  password: string = '';
  // variable para indicar si la contraseña es valida
  isValid = false;

  // inyeccion de dependencias: router, auth, userService, route, snackbar
  constructor(
    private router: Router,
    private auth: Auth,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackbar: SnackbarService
  ) {
    // obtiene el email desde los parametros de la ruta y lo guarda en userService
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      if (email) {
        this.userService.email = email;
      }
    });
  }

  // metodo para validar que la contraseña tenga al menos 6 caracteres
  validatePassword() {
    this.isValid = this.password.length >= 6;
  }

  // metodo para continuar con el inicio de sesion
  async continue() {
    try {
      const email = this.userService.email;
      const result = await signInWithEmailAndPassword(this.auth, email, this.password);
      console.log('Inicio de sesión exitoso:', result.user); // log de usuario autenticado
      this.router.navigate(['/home']); // redirige al home
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error); // log de error
      // muestra mensajes personalizados segun el tipo de error
      if (error.code === 'auth/wrong-password') {
        this.snackbar.mostrar('Contraseña incorrecta.', 'error');
      } else if (error.code === 'auth/user-not-found') {
        this.snackbar.mostrar('El usuario no existe.', 'error');
      } else {
        this.snackbar.mostrar('Error al iniciar sesión. Inténtalo más tarde.', 'error');
      }
    }
  }

  // metodo para volver a la pantalla de login por email
  goBack() {
    this.router.navigate(['/email-login']);
  }
}
