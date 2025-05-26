import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';

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

  constructor(
    private router: Router,
    private auth: Auth,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackbar: SnackbarService
  ) {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      if (email) {
        this.userService.email = email;
      }
    });
  }

  validatePassword() {
    this.isValid = this.password.length >= 6;
  }

  async continue() {
    try {
      const email = this.userService.email;
      const result = await signInWithEmailAndPassword(this.auth, email, this.password);
      console.log('Inicio de sesión exitoso:', result.user);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      if (error.code === 'auth/wrong-password') {
        this.snackbar.mostrar('Contraseña incorrecta.', 'error');
      } else if (error.code === 'auth/user-not-found') {
        this.snackbar.mostrar('El usuario no existe.', 'error');
      } else {
        this.snackbar.mostrar('Error al iniciar sesión. Inténtalo más tarde.', 'error');
      }
    }
  }

  goBack() {
    this.router.navigate(['/email-login']);
  }
}
