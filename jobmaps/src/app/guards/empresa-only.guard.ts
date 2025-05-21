import { CanActivateFn } from '@angular/router';

export const empresaOnlyGuard: CanActivateFn = (route, state) => {
  return true;
};
