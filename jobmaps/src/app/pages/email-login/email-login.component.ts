// importacion de decoradores y modulos de angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// importacion del servicio de rutas de angular
import { Router } from '@angular/router';
// importacion de clases y funciones de autenticacion de firebase
import {
  Auth,
  fetchSignInMethodsForEmail,
} from '@angular/fire/auth';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-email-login', // selector para usar el componente en html
  standalone: true, // componente independiente
  imports: [CommonModule, FormsModule], // modulos importados
  templateUrl: './email-login.component.html', // ruta del template html
  styleUrls: ['./email-login.component.scss'], // ruta de los estilos
})
export class EmailLoginComponent {
  // variable para almacenar el email introducido por el usuario
  email: string = '';

  // inyeccion de dependencias: router y servicio de autenticacion
  constructor(private router: Router, private auth: Auth) {}

  // metodo para volver a la pantalla de login
  goBack() {
    this.router.navigate(['/login']);
  }

  // metodo para comprobar si el email esta registrado en firebase auth
  checkEmail() {
    fetchSignInMethodsForEmail(this.auth, this.email)
      .then((methods) => {
        if (methods.length > 0) {
          // el email ya existe en firebase auth
          this.router.navigate(['/email-password'], { queryParams: { email: this.email } });
        } else {
          // el email no esta registrado
          this.router.navigate(['/register-step1'], { queryParams: { email: this.email } });
        }
      })
      .catch((error) => {
        console.error('Error al comprobar el email:', error); // log de error
      });
  }

  // getter que valida el formato del email
  get isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email); // devuelve true si el email es valido
  }
}
