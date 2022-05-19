import { TestBed } from '@angular/core/testing';

import { SidbarPhotosService } from './sidbar-photos.service';

describe('SidbarPhotosService', () => {
  let service: SidbarPhotosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidbarPhotosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
