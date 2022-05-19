import { TestBed } from '@angular/core/testing';

import { RequestsInterceptor } from './requests.interceptor';

describe('RequestsInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RequestsInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RequestsInterceptor = TestBed.inject(RequestsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
