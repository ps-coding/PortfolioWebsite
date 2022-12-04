import { TestBed } from '@angular/core/testing';

import { SuperadminAuthGuardService } from './superadmin-auth-guard.service';

describe('SuperadminAuthGuardService', () => {
  let service: SuperadminAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperadminAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
