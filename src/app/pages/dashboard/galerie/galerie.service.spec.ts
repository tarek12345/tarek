import { TestBed } from '@angular/core/testing';

import { GalerieService } from './galerie.service';

describe('GalerieService', () => {
  let service: GalerieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalerieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
