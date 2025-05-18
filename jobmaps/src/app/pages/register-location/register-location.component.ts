import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-location.component.html',
  styleUrls: ['./register-location.component.scss'],
})
export class RegisterLocationComponent {
  constructor(private router: Router, private userService: UserService) {}

  useCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
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
        alert('Unable to retrieve your location');
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
