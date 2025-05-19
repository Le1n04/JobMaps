import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent {
  fullName: string = '';
  age: number = 0;
  country: string = '';
  role: 'empresa' | 'desempleado' = 'desempleado';
  email: string = '';
  phoneNumber: string = '';

  constructor(public userService: UserService, private router: Router, private location : Location, private authService: AuthService) {
    // Cargamos desde UserService
    this.fullName = userService.fullName;
    this.age = userService.age;
    this.country = userService.country;
    this.role = userService.userData.role ?? 'desempleado';
    this.email = userService.email;
  }

  saveChanges() {
    alert('Changes saved (you can implement save to Firestore here).');
    this.router.navigate(['/home']);
  }

  changeLocation() {
    this.router.navigate(['/select-location'], { queryParams: { from: 'profile' } });
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.authService.logout();
  }
}
