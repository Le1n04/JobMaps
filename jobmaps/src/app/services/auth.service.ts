// importacion de decoradores y servicios de angular y firebase
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

// decorador que define el servicio como disponible en toda la aplicacion
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // variable privada para almacenar el usuario autenticado
  private _user: User | null = null;

  // inyeccion de dependencias: auth, router, snackbar y userService
  constructor(
    private auth: Auth,
    private router: Router,
    private snackbar: SnackbarService,
    private userService: UserService
  ) {
    // suscripcion al estado de autenticacion
    onAuthStateChanged(this.auth, (user) => {
      this._user = user;
    });
  }

  // metodo para iniciar sesion con google
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
            // guarda ubicacion por defecto (malaga centro)
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

  // metodo para registrar usuario con email y contraseña
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

  // metodo para cerrar sesion
  logout() {
    return signOut(this.auth).then(() => {
      this._user = null;
      this.router.navigate(['/login']);
    });
  }

  // getter para obtener el usuario actual
  get currentUser(): User | null {
    return this._user;
  }

  // metodo para verificar si hay usuario autenticado
  isAuthenticated(): boolean {
    return this._user !== null;
  }
}
