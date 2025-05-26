import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { SnackbarService } from './snackbar.service';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: User | null = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private snackbar: SnackbarService,
    private userService: UserService
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this._user = user;
    });
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this._user = result.user;
      console.log('Usuario autenticado:', this._user);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.userService.setLocation(latitude, longitude);
            console.log('Ubicación guardada:', latitude, longitude);
            this.router.navigate(['/home']);
          },
          (error) => {
            console.warn(
              'No se pudo obtener ubicación, se usará la predeterminada:',
              error
            );
            // Guardar ubicación por defecto (Málaga centro)
            this.userService.setLocation(36.7213, -4.4214);
            this.router.navigate(['/home']);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        console.warn('Geolocation no soportada');
        this.userService.setLocation(36.7213, -4.4214);
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
    }
  }

  async registerWithEmailAndPassword(password: string) {
    try {
      const email = this.userService.email;
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName: this.userService.fullName,
      });

      console.log('Usuario registrado con éxito:', result.user);

      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error registrando usuario:', error);
      this.snackbar.mostrar('No se pudo crear el usuario');
    }
  }

  logout() {
    return signOut(this.auth).then(() => {
      this._user = null;
      this.router.navigate(['/login']);
    });
  }

  get currentUser(): User | null {
    return this._user;
  }

  isAuthenticated(): boolean {
    return this._user !== null;
  }
}
