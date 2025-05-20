import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent {
  fullName = '';
  age: number | null = null;
  country = '';
  role: 'empresa' | 'desempleado' = 'desempleado';
  location = { lat: 0, lng: 0 };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private prevLocation: Location,
  ) {
    // Cargar datos actuales
    this.fullName = this.userService.fullName;
    this.age = this.userService.age;
    this.country = this.userService.country;
    this.role = this.userService.role;
    this.location = this.userService.location;
  }

  async guardarCambios() {
    if (!this.fullName || !this.age || !this.country || !this.role) return;

    // Actualizar localmente
    this.userService.fullName = this.fullName;
    this.userService.age = this.age;
    this.userService.country = this.country;
    this.userService.role = this.role;

    try {
      // Guardar en Firestore
      await this.userService.updateUserInFirestore(this.userService.uid, {
        fullName: this.fullName,
        age: this.age,
        country: this.country,
        role: this.role,
        location: this.userService.location, // ✅ aquí está la clave
      });

      alert('✅ Cambios guardados correctamente.');
    } catch (err) {
      console.error('❌ Error al guardar en Firestore:', err);
      alert('Error al guardar los cambios.');
    }
  }

  cambiarUbicacion() {
    this.router.navigate(['/select-location'], {
      queryParams: { from: 'profile' },
    });
  }

  logout() {
    this.authService.logout();
  }

  goBack()
  {
    this.prevLocation.back();
  }
}
