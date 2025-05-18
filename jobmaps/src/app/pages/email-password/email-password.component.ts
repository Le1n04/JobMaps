import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-email-password',
  templateUrl: './email-password.component.html',
  styleUrls: ['./email-password.component.scss'],
  imports: [FormsModule],
})
export class EmailPasswordComponent {
  password: string = '';
  isValid = false;

  constructor(private router: Router) {}

  validatePassword() {
    this.isValid = this.password.length >= 6;
  }

  continue() {
    // Lógica de autenticación irá aquí
    console.log('Iniciar sesión con contraseña:', this.password);
    this.router.navigate(['/home']);
  }

  goBack() {
    this.router.navigate(['/email-login']);
  }
}
