import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-password.component.html',
  styleUrls: ['./register-password.component.scss']
})
export class RegisterPasswordComponent {
  password: string = '';
  error: string = '';

  constructor(
    private router: Router,
    private auth: Auth,
    private userService: UserService
  ) {}

  get isPasswordValid(): boolean {
    return this.password.length >= 6;
  }

  async register() {
    const email = this.userService.email;
    const fullName = this.userService.fullName;

    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, this.password);
      await updateProfile(result.user, { displayName: fullName });
      console.log('Usuario creado correctamente:', result.user);

      // Aquí podrías redirigir al home o al siguiente paso
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error al crear el usuario:', error);
      this.error = error.message;
    }
  }

  goBack() {
    this.router.navigate(['/register-location']);
  }
}
