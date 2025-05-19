import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Auth,
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';

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

  checkEmail() {
    fetchSignInMethodsForEmail(this.auth, this.email)
      .then((methods) => {
        if (methods.length > 0) {
          // El email ya existe en Firebase Auth
          this.router.navigate(['/email-password'], { queryParams: {email: this.email } });
        } else {
          // El email no está registrado
          this.router.navigate(['/register-step1'], { queryParams: { email:this.email } });
        }
      })
      .catch((error) => {
        console.error('Error al comprobar el email:', error);
      });
  }

  get isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}
