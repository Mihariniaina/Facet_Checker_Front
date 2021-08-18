import { TestBed } from '@angular/core/testing';

import { LpNewvalidatorService } from './lp-newvalidator.service';

describe('LpNewvalidatorService', () => {
  let service: LpNewvalidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LpNewvalidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
