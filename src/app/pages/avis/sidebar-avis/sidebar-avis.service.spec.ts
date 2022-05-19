import { TestBed } from '@angular/core/testing';

import { SidebarAvisService } from './sidebar-avis.service';

describe('SidebarAvisService', () => {
  let service: SidebarAvisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarAvisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
