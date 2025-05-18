import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { registrationFlowGuard } from './registration-flow.guard';

describe('registrationFlowGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => registrationFlowGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
