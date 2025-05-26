import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-register-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-location.component.html',
  styleUrls: ['./register-location.component.scss'],
})
export class RegisterLocationComponent {
  constructor(private router: Router, private userService: UserService, private snackbar: SnackbarService) {}

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

  selectLocationManually() {
    this.router.navigate(['/select-location']);
  }

  goBack() {
    this.router.navigate(['/register-step1']);
  }
}
