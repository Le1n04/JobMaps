import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-email-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent {
  email: string = '';

  constructor(private router: Router, private auth: Auth) {}

  goBack() {
    this.router.navigate(['/login']);
  }

  async continuar() {
    if (!this.email) return;

    try {
      // Intenta iniciar sesión con contraseña vacía (nunca funcionará, pero sirve para detectar si existe el usuario)
      await signInWithEmailAndPassword(this.auth, this.email, '');
    } catch (error: any) {
      const code = error.code;
      console.log('Código de error:', code);

      if (code === 'auth/user-not-found') {
        // Email no existe → registro
        this.router.navigate(['/register-step1'], {
          queryParams: { email: this.email },
        });
      } else if (
        code === 'auth/wrong-password' ||
        code === 'auth/missing-password'
      ) {
        // Usuario existe → login con contraseña
        this.router.navigate(['/email-password'], {
          queryParams: { email: this.email },
        });
      } else {
        console.error('Error desconocido:', error);
        alert('No se pudo comprobar el email. Inténtalo más tarde.');
      }
    }
  }

  get isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}
