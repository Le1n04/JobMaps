import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = await new Promise(resolve => {
    const unsub = authService['auth'].onAuthStateChanged(u => {
      unsub();
      resolve(u);
    });
  });

  if (user) {
    router.navigate(['/home']);
    return false;
  } else {
    return true;
  }
};
