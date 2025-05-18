import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-email-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent {
  email: string = '';

  constructor(
    private router: Router,
    private userService: UserService // 👈 Inyectar servicio
  ) {}

  goBack() {
    this.router.navigate(['/login']);
  }

  continuar() {
    if (!this.email) return;

    // 👉 Guardamos el email en el servicio
    this.userService.email = this.email;

    // Simulación: si contiene "user" es un usuario registrado
    if (this.email.includes('user')) {
      this.router.navigate(['/email-password'], { queryParams: { email: this.email } });
    } else {
      this.router.navigate(['/register-step1'], { queryParams: { email: this.email } });
    }
  }

  get isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}
