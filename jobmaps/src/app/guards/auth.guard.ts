import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = await new Promise(resolve => {
    const unsub = auth.onAuthStateChanged(u => {
      unsub();
      resolve(u);
    });
  });

  if (user) {
    return true;
  } else {
    await router.navigate(['/login']);
    return false;
  }
};
