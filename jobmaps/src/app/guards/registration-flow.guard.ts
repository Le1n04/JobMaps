import { CanActivateFn } from '@angular/router';

export const registrationFlowGuard: CanActivateFn = (route, state) => {
  return true;
};
