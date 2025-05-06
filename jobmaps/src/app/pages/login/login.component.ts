import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('usuario', JSON.stringify(res.usuario)); // guardar usuario
        alert('Login correcto');
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.error || 'Error al iniciar sesión');
      }
    });
  }
  
}
