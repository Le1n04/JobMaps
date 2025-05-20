import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

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
  ubicacionLegible: string = 'Cargando ubicación...';
  location = { lat: 0, lng: 0 };

  selectedFile: File | null = null;
  profilePictureUrl: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.fullName = this.userService.fullName;
    this.age = this.userService.age;
    this.country = this.userService.country;
    this.role = this.userService.role;
    this.location = this.userService.location;

    this.obtenerNombreUbicacion(this.location.lat, this.location.lng).then(
      (nombre) => {
        this.ubicacionLegible = nombre;
      }
    );
  }

  async guardarCambios() {
    if (!this.fullName || !this.age || !this.country || !this.role) return;

    this.userService.fullName = this.fullName;
    this.userService.age = this.age;
    this.userService.country = this.country;
    this.userService.role = this.role;

    try {
      await this.userService.updateUserInFirestore(this.userService.uid, {
        fullName: this.fullName,
        age: this.age,
        country: this.country,
        role: this.role,
        location: this.userService.location,
      });

      alert('✅ Cambios guardados correctamente.');
    } catch (err) {
      console.error('❌ Error al guardar en Firestore:', err);
      alert('Error al guardar los cambios.');
    }
  }

  async uploadProfilePicture(file: File) {
    const storage = getStorage();
    const path = `profile_pictures/${this.userService.uid}`;
    const storageRef = ref(storage, path);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      this.profilePictureUrl = downloadURL;
      console.log('✅ Imagen subida:', downloadURL);
    } catch (error) {
      console.error('❌ Error al subir la imagen:', error);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.uploadProfilePicture(file);
    }
  }

  async obtenerNombreUbicacion(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      const address = data.address;
      const town = address.city || address.town || address.village || '';
      const state = address.state || '';
      return `${town}, ${state}`.trim() || 'Ubicación desconocida';
    } catch (e) {
      console.error('Error al obtener ubicación legible:', e);
      return 'Ubicación desconocida';
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

  goBack() {
    this.router.navigate(['/home']);
  }
}
