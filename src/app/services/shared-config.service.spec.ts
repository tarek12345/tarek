import { TestBed } from '@angular/core/testing';

import { SharedConfigService } from './shared-config.service';

describe('SharedConfigService', () => {
  let service: SharedConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
