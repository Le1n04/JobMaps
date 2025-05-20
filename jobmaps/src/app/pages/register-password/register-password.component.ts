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
      // 1. Crear usuario en Firebase Auth
      const result = await createUserWithEmailAndPassword(this.auth, email, this.password);
      await updateProfile(result.user, { displayName: fullName });

      // 2. Crear documento en Firestore
      const uid = result.user.uid;
      const userData = {
        fullName: this.userService.fullName,
        age: this.userService.age,
        country: this.userService.country,
        role: this.userService.role,
        acceptedTerms: this.userService.acceptedTerms,
        location: this.userService.location,
      };
      console.log('🔍 fullName antes de crear Firestore:', this.userService.fullName);

      await this.userService.createUserDocument(uid, userData);

      console.log('✅ Usuario creado y documento guardado en Firestore');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('❌ Error al crear el usuario:', error);
      this.error = error.message;
    }
  }

  goBack() {
    this.router.navigate(['/register-location']);
  }
}
