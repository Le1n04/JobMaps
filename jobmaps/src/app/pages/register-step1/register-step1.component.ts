import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-step1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-step1.component.html',
  styleUrls: ['./register-step1.component.scss'],
})
export class RegisterStep1Component {
  fullName: string = '';
  age: number | null = null;
  country: string = '';
  acceptedTerms: boolean = false;

  constructor(private router: Router, private userService: UserService) {}

  get formValid(): boolean {
    return (
      this.fullName.trim().length > 0 &&
      !!this.age &&
      this.age > 0 &&
      this.country !== '' &&
      this.acceptedTerms
    );
  }

  continue() {
    if (!this.formValid) return;

    this.userService.fullName = this.fullName;
    this.userService.age = this.age!;
    this.userService.country = this.country;
    this.userService.acceptedTerms = this.acceptedTerms;

    this.router.navigate(['/register-location']);
  }

  goBack() {
    this.router.navigate(['/email-login']);
  }
}
