// importacion de decoradores y modulos de angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// importacion del servicio de rutas de angular
import { Router } from '@angular/router';
// importacion de servicios personalizados
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-register-location', // selector para usar el componente en html
  standalone: true, // componente independiente
  imports: [CommonModule], // modulos importados
  templateUrl: './register-location.component.html', // ruta del template html
  styleUrls: ['./register-location.component.scss'], // ruta del archivo de estilos
})
export class RegisterLocationComponent {
  // inyeccion de dependencias: router, userService y snackbar
  constructor(
    private router: Router,
    private userService: UserService,
    private snackbar: SnackbarService
  ) {}

  // metodo para usar la ubicacion actual del navegador
  useCurrentLocation() {
    if (!navigator.geolocation) {
      this.snackbar.mostrar('Geolocation is not supported by your browser', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Ubicación obtenida:', latitude, longitude);

        this.userService.setLocation(latitude, longitude);

        this.router.navigate(['/register-password']);
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
        this.snackbar.mostrar('Unable to retrieve your location', 'error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  // metodo para seleccionar la ubicacion manualmente
  selectLocationManually() {
    this.router.navigate(['/select-location']);
  }

  // metodo para volver al paso anterior del registro
  goBack() {
    this.router.navigate(['/register-step1']);
  }
}
