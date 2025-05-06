import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  rol = 'candidato'; // o 'empresa'

  constructor(private authService: AuthService) {}

  registrar() {
    const datos = { nombre: this.nombre, email: this.email, password: this.password, rol: this.rol };
    this.authService.registro(datos).subscribe({
      next: () => {
        alert('Usuario registrado');
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar');
      }
    });
  }
}
