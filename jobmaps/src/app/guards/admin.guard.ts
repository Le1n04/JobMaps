import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  async canActivate(): Promise<boolean> {
    // Si estamos en Server-Side Rendering (SSR)
    if (!isPlatformBrowser(this.platformId)) {
      // Si estamos en servidor, no intentar cargar el usuario
      return false;
    }

    await this.userService.usuarioCargado;

    if (this.userService.role === 'admin') {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
