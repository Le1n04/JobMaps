// importacion de decoradores y modulos de angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// importacion de servicio de rutas de angular
import { Router } from '@angular/router';
// importacion de funciones de autenticacion de firebase
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
// importacion del servicio de usuario
import { UserService } from '../../services/user.service';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-register-password', // selector para usar el componente en html
  standalone: true, // componente independiente
  imports: [CommonModule, FormsModule], // modulos importados
  templateUrl: './register-password.component.html', // ruta del template html
  styleUrls: ['./register-password.component.scss']
})
export class RegisterPasswordComponent {
  // variables para almacenar la contraseña y errores
  password: string = '';
  error: string = '';

  // inyeccion de dependencias: router, auth, userService
  constructor(
    private router: Router,
    private auth: Auth,
    private userService: UserService
  ) {}

  // getter para validar que la contraseña tenga al menos 6 caracteres
  get isPasswordValid(): boolean {
    return this.password.length >= 6;
  }

  // metodo para registrar un nuevo usuario
  async register() {
    const email = this.userService.email;
    const fullName = this.userService.fullName;

    try {
      // crea usuario en firebase auth
      const result = await createUserWithEmailAndPassword(this.auth, email, this.password);
      // actualiza el perfil con el nombre completo
      await updateProfile(result.user, { displayName: fullName });

      // obtiene el uid del usuario
      const uid = result.user.uid;
      // datos del usuario para firestore
      const userData = {
        fullName: this.userService.fullName,
        age: this.userService.age,
        country: this.userService.country,
        role: this.userService.role,
        acceptedTerms: this.userService.acceptedTerms,
        location: this.userService.location,
      };
      console.log('🔍 fullName antes de crear Firestore:', this.userService.fullName);

      // crea el documento de usuario en firestore
      await this.userService.createUserDocument(uid, userData);

      console.log('Usuario creado y documento guardado en Firestore');
      this.router.navigate(['/home']); // redirige al home
    } catch (error: any) {
      console.error('Error al crear el usuario:', error);
      this.error = error.message; // muestra mensaje de error
    }
  }

  // metodo para volver a la pagina anterior
  goBack() {
    this.router.navigate(['/register-location']);
  }
}
